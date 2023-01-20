import { ethErrors } from 'eth-rpc-errors'

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
    console.log(method, req)
    return internalMethods[method](req)
  }

  // TODO:
  // const hasVault = keyringService.hasVault()
  // if (!hasVault) {
  //   throw ethErrors.provider.userRejectedRequest({
  //     message: 'wallet must has at least one account'
  //   })
  // }

  return rpcFlow(req) as any
}
