/* eslint-disable @typescript-eslint/no-floating-promises */
import 'reflect-metadata'

import { ethErrors } from 'eth-rpc-errors'

import { MainController } from '@ambire-common/controllers/main/main'
import { DappProviderRequest } from '@ambire-common/interfaces/dapp'
import { ProviderController } from '@web/extension-services/background/provider/ProviderController'
import { RequestRes } from '@web/extension-services/background/provider/types'
import PromiseFlow from '@web/utils/promiseFlow'
import underline2Camelcase from '@web/utils/underline2Camelcase'

const lockedOrigins = new Set<string>()
const connectOrigins = new Set<string>()

const flow = new PromiseFlow<{
  request: DappProviderRequest
  mainCtrl: MainController
  mapMethod: string
  requestRes?: RequestRes
}>()

const flowContext = flow
  // validate the provided method
  .use(async ({ request, mainCtrl, mapMethod }, next) => {
    const { method, params } = request
    const providerCtrl = new ProviderController(mainCtrl)
    console.log('providerCtrl', providerCtrl)
    if (!(providerCtrl as any)[mapMethod]) {
      if (method.startsWith('eth_') || method === 'net_version') {
        return providerCtrl.ethRpc(request)
      }

      throw ethErrors.rpc.methodNotFound({
        message: `method [${method}] doesn't has corresponding handler`,
        data: { method, params }
      })
    }

    return next()
  })
  // unlock the wallet before proceeding with the request
  .use(async ({ request, mainCtrl, mapMethod }, next) => {
    const {
      session: { origin }
    } = request

    const providerCtrl = new ProviderController(mainCtrl)
    console.log('providerCtrl', providerCtrl)

    if (!Reflect.getMetadata('SAFE', providerCtrl, mapMethod)) {
      const isUnlock = mainCtrl.keystore.isReadyToStoreKeys ? mainCtrl.keystore.isUnlocked : true

      if (!isUnlock && mainCtrl.dapps.hasPermission(origin)) {
        if (lockedOrigins.has(origin)) {
          throw ethErrors.rpc.resourceNotFound('Already processing unlock. Please wait.')
        }
        lockedOrigins.add(origin)
        try {
          await new Promise((resolve, reject) => {
            mainCtrl.buildUserRequestFromDAppRequest(
              { ...request, method: 'unlock', params: {} },
              { resolve, reject, session: request.session }
            )
          })
          lockedOrigins.delete(origin)
        } catch (e) {
          lockedOrigins.delete(origin)
          throw e
        }
      }
    }

    return next()
  })
  // if dApp not connected - prompt connect action window
  .use(async ({ request, mainCtrl, mapMethod }, next) => {
    const {
      session: { origin, name, icon }
    } = request
    const providerCtrl = new ProviderController(mainCtrl)
    console.log('providerCtrl', providerCtrl)
    if (!Reflect.getMetadata('SAFE', providerCtrl, mapMethod)) {
      if (!mainCtrl.dapps.hasPermission(origin)) {
        if (connectOrigins.has(origin)) {
          throw ethErrors.rpc.resourceNotFound('Already processing connect. Please wait.')
        }
        try {
          connectOrigins.add(origin)
          await new Promise((resolve, reject) => {
            mainCtrl.buildUserRequestFromDAppRequest(
              { ...request, method: 'dapp_connect', params: {} },
              { resolve, reject, session: request.session }
            )
          })
          connectOrigins.delete(origin)
          mainCtrl.dapps.addDapp({
            name,
            url: origin,
            icon,
            description: 'Custom dApp automatically added when connected for the first time.',
            favorite: false,
            chainId: 1,
            isConnected: true
          })
          mainCtrl.dapps.broadcastDappSessionEvent(
            'chainChanged',
            { chain: '0x1', networkVersion: '1' },
            origin
          )
        } catch (e) {
          connectOrigins.delete(origin)
          throw e
        }
      }
    }

    return next()
  })
  // add the dapp request as a userRequest and action
  .use(async (props, next) => {
    const { request, mainCtrl, mapMethod } = props
    const providerCtrl = new ProviderController(mainCtrl)
    console.log('providerCtrl', providerCtrl)

    const [requestType, condition] =
      Reflect.getMetadata('ACTION_REQUEST', providerCtrl, mapMethod) || []
    if (requestType && (!condition || !condition(props))) {
      // eslint-disable-next-line no-param-reassign
      props.requestRes = await new Promise((resolve, reject) => {
        mainCtrl
          .buildUserRequestFromDAppRequest(request, {
            resolve,
            reject,
            session: request.session
          })
          .catch((error) => reject(error))
      })
    }

    return next()
  })
  .use(async ({ request, mainCtrl, mapMethod, requestRes }) => {
    const providerCtrl = new ProviderController(mainCtrl)
    console.log('providerCtrl', providerCtrl)

    return Promise.resolve((providerCtrl as any)[mapMethod]({ ...request, requestRes }))
  })
  .callback()

export default (request: DappProviderRequest, mainCtrl: MainController) => {
  return flowContext({ request, mainCtrl, mapMethod: underline2Camelcase(request.method) })
}
