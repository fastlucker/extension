import { networks } from 'ambire-common/src/consts/networks'
import { UserRequest } from 'ambire-common/src/interfaces/userRequest'
import { parse } from 'ambire-common/src/libs/bigintJson/bigintJson'

import permission from '../services/permission'

class UserNotification {
  createSignMessageUserRequest({
    id,
    data,
    origin,
    selectedAccount,
    onError,
    onSuccess
  }: {
    id: number
    data: any
    origin: string
    selectedAccount: string
    onError: (msg: string) => void
    onSuccess: (data: any, id: number) => void
  }) {
    const msg = data
    if (!msg) {
      onError('No msg request to sign')
      return
    }

    if (msg?.[1]?.toLowerCase() !== selectedAccount.toLowerCase()) {
      onSuccess('Invalid parameters: must use the current user address to sign', id)
      return
    }

    const network = networks.find(
      (n) => Number(n.chainId) === Number(permission.getConnectedSite(origin)?.chainId)
    )

    if (!network) {
      onError('Unsupported network')
      return
    }

    const request: UserRequest = {
      id,
      action: {
        kind: 'message',
        message: msg[0]
      },
      networkId: network.id,
      accountAddr: selectedAccount,
      forceNonce: null
    }

    return request
  }

  createSignTypedDataUserRequest({
    id,
    data,
    origin,
    selectedAccount,
    onError,
    onSuccess
  }: {
    id: number
    data: any
    origin: string
    selectedAccount: string
    onError: (msg: string) => void
    onSuccess: (data: any, id: number) => void
  }) {
    const msg = data
    if (!msg) {
      onError('No msg request to sign')
      return
    }
    if (msg?.[0]?.toLowerCase() !== selectedAccount.toLowerCase()) {
      // resolve with error to handle the error in the ProviderController
      onSuccess(
        {
          error: 'Invalid parameters: must use the current user address to sign'
        },
        id
      )
      return
    }

    const messageToSign = msg?.[1]
    if (!messageToSign) {
      onError('No msg request in received params')
      return
    }
    let typedData: any = {}
    try {
      typedData = parse(messageToSign)
    } catch (error) {
      onError('Invalid typedData format')
    }

    if (!typedData?.types || !typedData.domain || !typedData?.message) {
      onError('Invalid typedData v4 format')
    }

    const network = networks.find(
      (n) => Number(n.chainId) === Number(permission.getConnectedSite(origin)?.chainId)
    )

    if (!network) {
      onError('Unsupported network')
      return
    }

    const request: UserRequest = {
      id,
      action: {
        kind: 'typedMessage',
        types: typedData.types,
        domain: typedData.domain,
        message: typedData.message,
        primaryType: typedData.primaryType
      },
      networkId: network.id,
      accountAddr: selectedAccount,
      forceNonce: null
    }

    return request
  }

  createAccountOpUserRequest({
    id,
    txn,
    txs,
    selectedAccount,
    origin: dappOrigin,
    onError
  }: {
    id: number
    txn: any
    txs: any
    origin: string
    selectedAccount: string
    onError: (msg: string) => void
    onSuccess: (data: any, id: number) => void
  }) {
    if (txs?.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const i in txs) {
        // eslint-disable-next-line no-param-reassign
        if (!txs[i].from) txs[i].from = selectedAccount
      }
    } else {
      onError(`No txs request in received params for account: ${selectedAccount}`)
      return
    }
    const network = networks.find(
      (n) => Number(n.chainId) === Number(permission.getConnectedSite(dappOrigin)?.chainId)
    )

    if (!network) {
      onError('Unsupported network')
      return
    }

    const request: UserRequest = {
      id,
      action: {
        kind: 'call',
        ...txn
      },
      networkId: network.id,
      accountAddr: selectedAccount,
      // TODO: ?
      forceNonce: null
    }

    return request
  }
}

export default new UserNotification()
