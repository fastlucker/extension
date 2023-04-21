// @ts-nocheck
import internalMethods from '@mobile/modules/web3/services/webview-background/provider/internalMethods'
import rpcFlow from '@mobile/modules/web3/services/webview-background/provider/rpcFlow'
import { ProviderRequest } from '@mobile/modules/web3/services/webview-background/provider/types'

export default async <T = void>(req: ProviderRequest, openApprovalModal): Promise<T> => {
  const {
    data: { method }
  } = req

  if (internalMethods[method]) {
    return internalMethods[method](req)
  }

  return rpcFlow(req, openApprovalModal) as any
}
