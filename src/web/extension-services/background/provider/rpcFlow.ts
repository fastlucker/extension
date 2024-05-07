/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-shadow */
import 'reflect-metadata'

import { ethErrors } from 'eth-rpc-errors'

import { delayPromise } from '@common/utils/promises'
import { ProviderController } from '@web/extension-services/background/provider/ProviderController'
import { ProviderRequest } from '@web/extension-services/background/provider/types'
import PromiseFlow from '@web/utils/promiseFlow'
import underline2Camelcase from '@web/utils/underline2Camelcase'

const lockedOrigins = new Set<string>()
const connectOrigins = new Set<string>()

const flow = new PromiseFlow<ProviderRequest & { mapMethod: string; requestRes?: any }>()

const flowContext = flow
  .use(async (request, next) => {
    const {
      data: { method },
      mainCtrl,
      dappsCtrl
    } = request

    const providerCtrl = new ProviderController(mainCtrl, dappsCtrl)
    if (!(providerCtrl as any)[request.mapMethod]) {
      if (method.startsWith('eth_') || method === 'net_version') {
        return providerCtrl.ethRpc(request)
      }

      throw ethErrors.rpc.methodNotFound({
        message: `method [${method}] doesn't has corresponding handler`,
        data: request.data
      })
    }

    return next()
  })
  .use(async (request, next) => {
    const {
      mapMethod,
      session: { origin },
      mainCtrl,
      dappsCtrl,
      notificationCtrl
    } = request
    const providerCtrl = new ProviderController(mainCtrl, dappsCtrl)
    if (!Reflect.getMetadata('SAFE', providerCtrl, mapMethod)) {
      const isUnlock = mainCtrl.keystore.isReadyToStoreKeys ? mainCtrl.keystore.isUnlocked : true

      if (!isUnlock && dappsCtrl.hasPermission(origin)) {
        if (lockedOrigins.has(origin)) {
          throw ethErrors.rpc.resourceNotFound('Already processing unlock. Please wait.')
        }
        lockedOrigins.add(origin)
        try {
          await notificationCtrl.requestNotificationRequest({
            screen: 'Unlock',
            params: { origin }
          })
          lockedOrigins.delete(origin)
        } catch (e) {
          lockedOrigins.delete(origin)
          throw e
        }
        // awaits the notification ctrl to resolve with this request before continuing with the actual dapp req
        await delayPromise(350)
      }
    }

    return next()
  })
  .use(async (request, next) => {
    // check connect
    const {
      session: { origin, name, icon },
      mainCtrl,
      dappsCtrl,
      notificationCtrl,
      mapMethod
    } = request
    const providerCtrl = new ProviderController(mainCtrl, dappsCtrl)
    if (!Reflect.getMetadata('SAFE', providerCtrl, mapMethod)) {
      if (!dappsCtrl.hasPermission(origin)) {
        if (connectOrigins.has(origin)) {
          throw ethErrors.rpc.resourceNotFound('Already processing connect. Please wait.')
        }
        connectOrigins.add(origin)
        try {
          await notificationCtrl.requestNotificationRequest({
            params: { origin, name, icon },
            screen: 'DappConnectRequest'
          })
          connectOrigins.delete(origin)
          dappsCtrl.addDapp({
            name,
            url: origin,
            icon,
            description: 'Custom dApp automatically added when connected for the first time.',
            favorite: false,
            chainId: 1,
            isConnected: true
          })
        } catch (e) {
          connectOrigins.delete(origin)
          throw e
        }
      }
    }

    return next()
  })
  .use(async (request, next) => {
    // check need notification request
    const {
      data: { method, params },
      session: { origin, name, icon },
      mainCtrl,
      dappsCtrl,
      notificationCtrl,
      mapMethod
    } = request
    const providerCtrl = new ProviderController(mainCtrl, dappsCtrl)
    const [requestType, condition] =
      Reflect.getMetadata('NOTIFICATION_REQUEST', providerCtrl, mapMethod) || []
    if (requestType && (!condition || !condition(request))) {
      request.requestRes = await notificationCtrl.requestNotificationRequest({
        screen: requestType,
        params: { method, data: params, session: { origin, name, icon } },
        origin
      })
    }

    return next()
  })
  .use(async (request) => {
    const providerCtrl = new ProviderController(request.mainCtrl, request.dappsCtrl)
    const { mapMethod } = request

    return Promise.resolve((providerCtrl as any)[mapMethod](request))
  })
  .callback()

export default (request: ProviderRequest) => {
  return flowContext({ ...request, mapMethod: underline2Camelcase(request.data.method) })
}
