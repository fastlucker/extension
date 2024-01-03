/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-shadow */
import 'reflect-metadata'

import { ethErrors } from 'eth-rpc-errors'

import { EVENTS } from '@web/constants/common'
import { ProviderController } from '@web/extension-services/background/provider/ProviderController'
import { ProviderRequest } from '@web/extension-services/background/provider/types'
import permissionService from '@web/extension-services/background/services/permission'
import eventBus from '@web/extension-services/event/eventBus'
import PromiseFlow from '@web/utils/promiseFlow'
import underline2Camelcase from '@web/utils/underline2Camelcase'

const isSignRequest = (type: string) => {
  const SIGN_REQUESTS = ['SignText', 'SignTypedData', 'SendTransaction']
  return SIGN_REQUESTS.includes(type)
}

const lockedOrigins = new Set<string>()
const connectOrigins = new Set<string>()

const flow = new PromiseFlow<{
  request: ProviderRequest & {
    session: Exclude<ProviderRequest, void>
  }
  mapMethod: string
  requestRes: any
}>()
const flowContext = flow
  .use(async (ctx, next) => {
    // check method
    const {
      data: { method },
      mainCtrl
    } = ctx.request
    ctx.mapMethod = underline2Camelcase(method)
    const providerCtrl = new ProviderController(mainCtrl)
    if (!(providerCtrl as any)[ctx.mapMethod]) {
      if (method.startsWith('eth_') || method === 'net_version') {
        return providerCtrl.ethRpc(ctx.request)
      }

      throw ethErrors.rpc.methodNotFound({
        message: `method [${method}] doesn't has corresponding handler`,
        data: ctx.request.data
      })
    }

    return next()
  })
  .use(async (ctx, next) => {
    const {
      mapMethod,
      request: {
        session: { origin },
        mainCtrl,
        notificationCtrl
      }
    } = ctx
    const providerCtrl = new ProviderController(mainCtrl)
    if (!Reflect.getMetadata('SAFE', providerCtrl, mapMethod)) {
      // const isUnlock = mainCtrl.keystore.isUnlocked
      const isUnlock = true
      if (!isUnlock) {
        if (lockedOrigins.has(origin)) {
          throw ethErrors.rpc.resourceNotFound('Already processing unlock. Please wait.')
        }
        ctx.request.requestedNotificationRequest = true
        lockedOrigins.add(origin)
        try {
          await notificationCtrl.requestNotificationRequest({ lock: true })
          lockedOrigins.delete(origin)
        } catch (e) {
          lockedOrigins.delete(origin)
          throw e
        }
      }
    }

    return next()
  })
  .use(async (ctx, next) => {
    // check connect
    const {
      request: {
        session: { origin, name, icon },
        mainCtrl,
        notificationCtrl
      },
      mapMethod
    } = ctx
    const providerCtrl = new ProviderController(mainCtrl)
    if (!Reflect.getMetadata('SAFE', providerCtrl, mapMethod)) {
      if (!permissionService.hasPermission(origin)) {
        if (connectOrigins.has(origin)) {
          throw ethErrors.rpc.resourceNotFound('Already processing connect. Please wait.')
        }
        ctx.request.requestedNotificationRequest = true
        connectOrigins.add(origin)
        try {
          await notificationCtrl.requestNotificationRequest({
            params: { origin, name, icon },
            screen: 'DappConnectRequest'
          })
          connectOrigins.delete(origin)
          permissionService.addConnectedSite(origin, name, icon, 1)
        } catch (e) {
          connectOrigins.delete(origin)
          throw e
        }
      }
    }

    return next()
  })
  .use(async (ctx, next) => {
    // check need notification request
    const {
      request: {
        data: { method },
        session: { origin, name, icon },
        mainCtrl,
        notificationCtrl
      },
      mapMethod
    } = ctx
    const providerCtrl = new ProviderController(mainCtrl)
    const [requestType, condition] =
      Reflect.getMetadata('NOTIFICATION_REQUEST', providerCtrl, mapMethod) || []
    if (requestType && (!condition || !condition(ctx.request))) {
      ctx.request.requestedNotificationRequest = true
      ctx.requestRes = await notificationCtrl.requestNotificationRequest({
        screen: requestType,
        params: {
          $ctx: ctx?.request?.data?.$ctx,
          method,
          data: ctx.request.data.params,
          session: { origin, name, icon }
        },
        origin
      })
      if (isSignRequest(requestType)) {
        permissionService.updateConnectSite(origin, { isSigned: true }, true)
      } else {
        permissionService.touchConnectedSite(origin)
      }
    }

    return next()
  })
  .use(async (ctx) => {
    const providerCtrl = new ProviderController(ctx.request.mainCtrl)
    const { requestRes, mapMethod, request } = ctx

    // process request
    const [requestType] = Reflect.getMetadata('NOTIFICATION_REQUEST', providerCtrl, mapMethod) || []
    const { uiRequestComponent, ...rest } = requestRes || {}
    const {
      session: { origin }
    } = request
    const requestDefer = Promise.resolve(
      (providerCtrl as any)[mapMethod]({
        ...request,
        requestRes
      })
    )

    requestDefer
      .then((result) => {
        if (isSignRequest(requestType)) {
          eventBus.emit(EVENTS.broadcastToUI, {
            method: EVENTS.SIGN_FINISHED,
            params: {
              success: true,
              data: result
            }
          })
        }
        return result
      })
      .catch((e: any) => {
        if (isSignRequest(requestType)) {
          eventBus.emit(EVENTS.broadcastToUI, {
            method: EVENTS.SIGN_FINISHED,
            params: {
              success: false,
              errorMsg: JSON.stringify(e)
            }
          })
        }
      })
    async function requestNotificationRequestLoop({
      uiRequestComponent,
      ...rest
    }: any): Promise<any> {
      ctx.request.requestedNotificationRequest = true
      const res = await ctx.request.notificationCtrl.requestNotificationRequest({
        screen: uiRequestComponent,
        params: rest,
        origin,
        requestType
      })
      if (res.uiRequestComponent) {
        return await requestNotificationRequestLoop(res)
      }
      return res
    }
    if (uiRequestComponent) {
      ctx.request.requestedNotificationRequest = true
      return await requestNotificationRequestLoop({ uiRequestComponent, ...rest })
    }

    return requestDefer
  })
  .callback()

export default (request: ProviderRequest) => {
  const ctx: any = { request: { ...request, requestedNotificationRequest: false } }
  return flowContext(ctx).finally(() => {
    if (ctx.request.requestedNotificationRequest) {
      flow.requestedNotificationRequest = false
    }
  })
}
