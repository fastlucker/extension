import 'reflect-metadata'

import { ethErrors } from 'eth-rpc-errors'

import VaultController from '@modules/vault/services/VaultController'
import providerController from '@web/background/provider/ProviderController'
import { ProviderRequest } from '@web/background/provider/types'
import notificationService from '@web/background/services/notification'
import permissionService from '@web/background/services/permission'
import { EVENTS } from '@web/constants/common'
import eventBus from '@web/event/eventBus'
import PromiseFlow from '@web/utils/promiseFlow'
import underline2Camelcase from '@web/utils/underline2Camelcase'

const isSignApproval = (type: string) => {
  const SIGN_APPROVALS = ['SignText', 'SignTypedData', 'SignTx']
  return SIGN_APPROVALS.includes(type)
}

const lockedOrigins = new Set<string>()
const connectOrigins = new Set<string>()

const flow = new PromiseFlow<{
  request: ProviderRequest & {
    session: Exclude<ProviderRequest, void>
  }
  mapMethod: string
  approvalRes: any
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
    const {
      mapMethod,
      request: {
        session: { origin }
      }
    } = ctx
    if (!Reflect.getMetadata('SAFE', providerController, mapMethod)) {
      const isUnlock = VaultController.isVaultUnlocked()
      if (!isUnlock) {
        if (lockedOrigins.has(origin)) {
          throw ethErrors.rpc.resourceNotFound('Already processing unlock. Please wait.')
        }
        ctx.request.requestedApproval = true
        lockedOrigins.add(origin)
        try {
          await notificationService.requestApproval({ lock: true })
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
        session: { origin, name, icon }
      },
      mapMethod
    } = ctx
    if (!Reflect.getMetadata('SAFE', providerController, mapMethod)) {
      if (!permissionService.hasPermission(origin)) {
        if (connectOrigins.has(origin)) {
          throw ethErrors.rpc.resourceNotFound('Already processing connect. Please wait.')
        }
        ctx.request.requestedApproval = true
        connectOrigins.add(origin)
        try {
          const { defaultChain } = await notificationService.requestApproval({
            params: { origin, name, icon },
            approvalComponent: 'PermissionRequest'
          })
          connectOrigins.delete(origin)
          permissionService.addConnectedSite(origin, name, icon, defaultChain)
        } catch (e) {
          connectOrigins.delete(origin)
          throw e
        }
      }
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
      mapMethod
    } = ctx
    const [approvalType, condition] =
      Reflect.getMetadata('APPROVAL', providerController, mapMethod) || []
    if (approvalType && (!condition || !condition(ctx.request))) {
      ctx.request.requestedApproval = true
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
      if (isSignApproval(approvalType)) {
        permissionService.updateConnectSite(origin, { isSigned: true }, true)
      } else {
        permissionService.touchConnectedSite(origin)
      }
    }

    return next()
  })
  .use(async (ctx) => {
    const { approvalRes, mapMethod, request } = ctx

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

export default (request: ProviderRequest) => {
  const ctx: any = { request: { ...request, requestedApproval: false } }
  return flowContext(ctx).finally(() => {
    if (ctx.request.requestedApproval) {
      flow.requestedApproval = false
      // only unlock notification if current flow is an approval flow
      notificationService.unLock()
    }
  })
}
