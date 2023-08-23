// Handles approval requests of type:
// eth_sendTransaction, gs_multi_send, ambire_sendBatchTransaction
// personal_sign, eth_sign
// eth_signTypedData, eth_signTypedData_v1, eth_signTypedData_v3, eth_signTypedData_v4
import { networks } from 'ambire-common/src/consts/networks'
import { UserRequest } from 'ambire-common/src/interfaces/userRequest'
import { parse } from 'ambire-common/src/libs/bigintJson/bigintJson'
import { useCallback, useEffect, useMemo } from 'react'

import permission from '@web/extension-services/background/services/permission'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState/useMainControllerState'

import { UseExtensionApprovalReturnType } from './types'

type Props = {
  approval: UseExtensionApprovalReturnType['approval']
  resolveApproval: UseExtensionApprovalReturnType['resolveApproval']
  rejectApproval: UseExtensionApprovalReturnType['rejectApproval']
}

const useSignApproval = ({ approval, resolveApproval, rejectApproval }: Props) => {
  const mainCtrlState = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const selectedAccount = mainCtrlState.selectedAccount || ''

  const approvalReqNetworkId = useMemo(
    () =>
      networks.find(
        (n) =>
          Number(n.chainId) ===
          Number(permission.getConnectedSite(approval?.data?.origin as string)?.chainId || 1)
      )?.id || networks[0].id,
    [approval?.data?.origin]
  )

  // handles eth_sign and personal_sign
  const handleSignText = useCallback(
    async (msg: any, method: string, id: bigint) => {
      if (!msg) {
        rejectApproval('No msg request to sign', msg)
        return
      }
      if (msg?.[1]?.toLowerCase() !== selectedAccount.toLowerCase()) {
        // resolve with error to handle the error in the ProviderController
        resolveApproval({
          error: 'Invalid parameters: must use the current user address to sign'
        })
        return
      }

      const messageToSign = msg?.[0]
      if (!messageToSign) {
        rejectApproval('No msg request in received params', msg)
        return
      }

      const request: UserRequest = {
        id,
        added: BigInt(Date.now()),
        action: {
          kind: 'message',
          message: messageToSign
        },
        networkId: approvalReqNetworkId,
        accountAddr: selectedAccount,
        forceNonce: null
      }

      dispatch({ type: 'MAIN_CONTROLLER_ADD_USER_REQUEST', params: request })
    },
    [selectedAccount, approvalReqNetworkId, dispatch, rejectApproval, resolveApproval]
  )

  // handles eth_signTypedData, eth_signTypedData_v1, eth_signTypedData_v3 and eth_signTypedData_v4
  const handleSignTypedData = useCallback(
    async (msg: any, method: string, id: bigint) => {
      if (!msg) {
        rejectApproval('No msg request to sign')
        return
      }
      if (msg?.[0]?.toLowerCase() !== selectedAccount.toLowerCase()) {
        // resolve with error to handle the error in the ProviderController
        resolveApproval({
          error: 'Invalid parameters: must use the current user address to sign'
        })
        return
      }

      const messageToSign = msg?.[1]
      if (!messageToSign) {
        rejectApproval('No msg request in received params')
        return
      }
      let typedData: any = {}
      try {
        typedData = parse(messageToSign)
      } catch (error) {
        rejectApproval('Invalid typedData format')
      }

      if (!typedData?.types || !typedData.domain || !typedData?.message) {
        rejectApproval('Invalid typedData v4 format')
      }

      const request: UserRequest = {
        id,
        added: BigInt(Date.now()),
        action: {
          kind: 'typedMessage',
          types: typedData.types,
          domain: typedData.domain,
          value: typedData.message
        },
        networkId: approvalReqNetworkId,
        accountAddr: selectedAccount,
        forceNonce: null
      }

      dispatch({ type: 'MAIN_CONTROLLER_ADD_USER_REQUEST', params: request })
    },
    [selectedAccount, approvalReqNetworkId, dispatch, rejectApproval, resolveApproval]
  )

  // handles eth_sendTransaction, gs_multi_send, ambire_sendBatchTransaction
  const handleSendTransactions = useCallback(
    async (txs: any, method: string, id: bigint) => {
      if (txs?.length) {
        // eslint-disable-next-line no-restricted-syntax
        for (const i in txs) {
          if (!txs[i].from) txs[i].from = selectedAccount
        }
      } else {
        rejectApproval(`No txs request in received params for account: ${selectedAccount}`, txs)
        // TODO: setRequests([])
        return
      }
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const ix in txs) {
        const request: UserRequest = {
          id,
          added: BigInt(Date.now()),
          action: {
            kind: 'call',
            ...(txs[ix] as any)
          },
          networkId: approvalReqNetworkId,
          accountAddr: selectedAccount,
          // TODO: ?
          forceNonce: null
        }

        dispatch({ type: 'MAIN_CONTROLLER_ADD_USER_REQUEST', params: request })
      }
    },
    [selectedAccount, approvalReqNetworkId, dispatch, rejectApproval]
  )

  // resolves the requests and returns a response to the background service
  const resolveMany = useCallback(
    (ids, resolution) => {
      // eslint-disable-next-line no-restricted-syntax
      // for (const req of requests.filter((r: any) => ids.includes(r.id))) {
      //   // only process non batch or first batch req
      //   if (req.id === approval?.id) {
      //     if (!req.isBatch) {
      //       if (!resolution) {
      //         rejectApproval('Nothing to resolve')
      //       } else if (!resolution.success) {
      //         rejectApproval(resolution.message)
      //       } else {
      //         // onSuccess
      //         resolveApproval({
      //           hash: resolution.result
      //         })
      //       }
      //     }
      //   }
      // }
      // // @ts-ignore
      // setRequests((prevRequests) => prevRequests.filter((x) => !ids.includes(x.id)))
    },
    [approval?.id, rejectApproval, resolveApproval]
  )

  useEffect(() => {
    if (approval) {
      const method = approval?.data?.params?.method
      const params = approval?.data?.params?.data
      const approvalId = approval?.id
      const origin = approval.data.origin

      if (
        ['eth_sendTransaction', 'gs_multi_send', 'ambire_sendBatchTransaction'].includes(method)
      ) {
        handleSendTransactions(params, method, approvalId)
      }
      if (['personal_sign', 'eth_sign'].includes(method)) {
        handleSignText(params, method, approvalId)
      }
      if (
        [
          'eth_signTypedData',
          'eth_signTypedData_v1',
          'eth_signTypedData_v3',
          'eth_signTypedData_v4'
        ].includes(method)
      ) {
        handleSignTypedData(params, method, approvalId)
      }
    }
  }, [approval, handleSendTransactions, handleSignText, handleSignTypedData])

  return {
    resolveMany
  }
}

export default useSignApproval
