import internalMethods from '@web/background/provider/internalMethods'
import rpcFlow from '@web/background/provider/rpcFlow'
import { ProviderRequest } from '@web/background/provider/types'
import sessionService from '@web/background/services/session'
import tab from '@web/background/webapi/tab'

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
