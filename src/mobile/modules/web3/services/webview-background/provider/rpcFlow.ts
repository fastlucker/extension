import 'reflect-metadata'

import { ethErrors } from 'eth-rpc-errors'

import eventBus from '@mobile/modules/web3/services/event/eventBus'
import PromiseFlow from '@mobile/modules/web3/services/utils/promiseFlow'
import underline2Camelcase from '@mobile/modules/web3/services/utils/underline2Camelcase'
import providerController from '@mobile/modules/web3/services/webview-background/provider/ProviderController'
import { ProviderRequest } from '@mobile/modules/web3/services/webview-background/provider/types'
import NotificationService from '@mobile/modules/web3/services/webview-background/services/notification'

export const EVENTS = {
  broadcastToUI: 'broadcastToUI',
  broadcastToBackground: 'broadcastToBackground',
  TX_COMPLETED: 'TX_COMPLETED',
  SIGN_FINISHED: 'SIGN_FINISHED'
}

const isSignApproval = (type: string) => {
  const SIGN_APPROVALS = ['SignText', 'SignTypedData', 'SendTransaction']
  return SIGN_APPROVALS.includes(type)
}

const flow = new PromiseFlow<{
  request: ProviderRequest & {
    session: Exclude<ProviderRequest, void>
  }
  mapMethod: string
  approvalRes: any
  openApprovalModal: (req: any) => void
}>()
const flowContext = flow
  .use(async (ctx, next) => {
    // check method
    const {
      data: { method }
    } = ctx.request
    ctx.mapMethod = underline2Camelcase(method)
    if (!providerController[ctx.mapMethod]) {
      if (method.startsWith('eth_') || method === 'net_version') {
        return providerController.ethRpc(ctx.request)
      }

      throw ethErrors.rpc.methodNotFound({
        message: `method [${method}] doesn't has corresponding handler`,
        data: ctx.request.data
      })
    }

    return next()
  })
  .use(async (ctx, next) => {
    // check need approval
    const {
      request: {
        data: { method },
        session: { origin, name, icon }
      },
      mapMethod,
      openApprovalModal
    } = ctx
    const [approvalType, condition] =
      Reflect.getMetadata('APPROVAL', providerController, mapMethod) || []
    if (approvalType && (!condition || !condition(ctx.request))) {
      ctx.request.requestedApproval = true
      const notificationService = new NotificationService({ openApprovalModal })
      ctx.approvalRes = await notificationService.requestApproval({
        approvalComponent: approvalType,
        params: {
          $ctx: ctx?.request?.data?.$ctx,
          method,
          data: ctx.request.data.params,
          session: { origin, name, icon }
        },
        origin
      })
    }

    return next()
  })
  .use(async (ctx) => {
    const { approvalRes, mapMethod, request, openApprovalModal } = ctx

    // process request
    const [approvalType] = Reflect.getMetadata('APPROVAL', providerController, mapMethod) || []
    const { uiRequestComponent, ...rest } = approvalRes || {}
    const {
      session: { origin }
    } = request
    const requestDefer = Promise.resolve(
      providerController[mapMethod]({
        ...request,
        approvalRes
      })
    )

    requestDefer
      .then((result) => {
        if (isSignApproval(approvalType)) {
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
        if (isSignApproval(approvalType)) {
          eventBus.emit(EVENTS.broadcastToUI, {
            method: EVENTS.SIGN_FINISHED,
            params: {
              success: false,
              errorMsg: JSON.stringify(e)
            }
          })
        }
      })
    async function requestApprovalLoop({ uiRequestComponent, ...rest }) {
      ctx.request.requestedApproval = true
      const notificationService = new NotificationService({ openApprovalModal })
      const res = await notificationService.requestApproval({
        approvalComponent: uiRequestComponent,
        params: rest,
        origin,
        approvalType,
        isUnshift: true
      })
      if (res.uiRequestComponent) {
        return await requestApprovalLoop(res)
      }
      return res
    }
    if (uiRequestComponent) {
      ctx.request.requestedApproval = true
      return await requestApprovalLoop({ uiRequestComponent, ...rest })
    }

    return requestDefer
  })
  .callback()

export default (request: ProviderRequest, openApprovalModal) => {
  const ctx: any = { request: { ...request, requestedApproval: false }, openApprovalModal }
  return flowContext(ctx).finally(() => {
    if (ctx.request.requestedApproval) {
      flow.requestedApproval = false
      // only unlock notification if current flow is an approval flow
      const notificationService = new NotificationService({ openApprovalModal })
      notificationService.unLock()
    }
  })
}
