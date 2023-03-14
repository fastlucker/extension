// @ts-nocheck
import internalMethods from '@web/extension-services/background/provider/internalMethods'
import rpcFlow from '@web/extension-services/background/provider/rpcFlow'
import { ProviderRequest } from '@web/extension-services/background/provider/types'
import sessionService from '@web/extension-services/background/services/session'
import tab from '@web/extension-services/background/webapi/tab'

tab.on('tabRemove', (id) => {
  sessionService.deleteSession(id)
})

export default async <T = void>(req: ProviderRequest): Promise<T> => {
  const {
    data: { method }
  } = req

  if (internalMethods[method]) {
    return internalMethods[method](req)
  }

  return rpcFlow(req) as any
}
