import { useCallback, useEffect } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useStorage from '@modules/common/hooks/useStorage'
import { USER_INTERVENTION_METHODS } from '@web/constants/userInterventionMethods'

import { UseExtensionApprovalReturnType } from './types'

const STORAGE_KEY = 'ambire_extension_state'

type Props = {
  approval: UseExtensionApprovalReturnType['approval']
  resolveApproval: UseExtensionApprovalReturnType['resolveApproval']
  rejectApproval: UseExtensionApprovalReturnType['rejectApproval']
}

const useSignApproval = ({ approval, resolveApproval, rejectApproval }: Props) => {
  const { selectedAcc: selectedAccount } = useAccounts()
  const { network } = useNetwork()
  const [requests, setRequests] = useStorage({
    key: STORAGE_KEY,
    defaultValue: [],
    setInit: (initialRequests) => (!Array.isArray(initialRequests) ? [] : initialRequests)
  })

  // eth_sign, personal_sign
  const handlePersonalSign = useCallback(
    async (message) => {
      const payload = message.data

      if (!payload) {
        console.error('AmbExHook: no payload', message)
        return
      }

      const id = `ambex_${payload.id}`
      let messageToSign = payload?.params?.message || payload?.params[0]
      if (
        payload.method === USER_INTERVENTION_METHODS.eth_sign ||
        payload.method === USER_INTERVENTION_METHODS.eth_signTypedData ||
        payload.method === USER_INTERVENTION_METHODS.eth_signTypedData_v4
      ) {
        messageToSign = payload?.params[1]
      }
      if (!messageToSign) {
        console.error('AmbExHook: no message in received payload')
        return
      }

      const request = {
        id,
        originalPayloadId: payload.id, // id for internal ambire requests purposes, originalPayloadId, to return
        type: payload.method,
        txn: messageToSign,
        chainId: network?.chainId,
        account: selectedAccount,
        originalMessage: message
      }

      setRequests((prevRequests) =>
        prevRequests.find((x) => x.id === request.id) ? prevRequests : [...prevRequests, request]
      )
    },
    [network?.chainId, selectedAccount, setRequests]
  )

  const handleSendTransactions = useCallback(
    async (txs: any) => {
      if (txs?.length) {
        // eslint-disable-next-line no-restricted-syntax
        for (const i in txs) {
          if (!txs[i].from) txs[i].from = selectedAccount
        }
      } else {
        throw Error('No txs in received payload')
      }
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const ix in txs) {
        const internalHookId = `ambex_tx:${JSON.stringify(txs[ix])}`
        const request = {
          id: internalHookId,
          type: 'eth_sendTransaction',
          isBatch: txs.length > 1,
          txn: txs[ix],
          chainId: network?.chainId,
          account: selectedAccount
        }

        // @ts-ignore
        setRequests((prevRequests) =>
          prevRequests.find((x: any) => x.id === request.id)
            ? prevRequests
            : [...prevRequests, request]
        )
      }
    },
    [network?.chainId, selectedAccount, setRequests]
  )

  const resolveMany = useCallback(
    (ids, resolution) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const req of requests.filter((x) => ids.includes(x.id))) {
        // only process non batch or first batch req
        if (!req.isBatch || req.id.endsWith(':0')) {
          const rpcResult: any = {
            jsonrpc: '2.0',
            id: req.originalPayloadId,
            txId: null,
            hash: null,
            result: null,
            success: null,
            error: null
          }

          if (!resolution) {
          } else if (!resolution.success) {
            rpcResult.error = resolution
            rpcResult.success = false
          } else {
            // onSuccess
            rpcResult.success = true
            rpcResult.txId = resolution.result
            rpcResult.hash = resolution.result
            rpcResult.result = resolution.result
          }
          // TODO:
          // !!sendMessage &&
          //   sendMessage({
          //     type: 'web3CallResponse',
          //     to: BACKGROUND,
          //     data: {
          //       originalMessage: req.originalMessage,
          //       rpcResult
          //     }
          //   })
        }
      }
      setRequests((prevRequests) => prevRequests.filter((x) => !ids.includes(x.id)))
    },
    [requests, setRequests]
  )

  useEffect(() => {
    if (approval) {
      const method = approval?.data?.params?.method
      const params = approval?.data?.params?.data
      if (
        method === 'eth_sendTransaction' ||
        method === 'gs_multi_send' ||
        method === 'ambire_sendBatchTransaction'
      ) {
        handleSendTransactions(params)
      }
      // if (
      //   params.route === USER_INTERVENTION_METHODS.eth_sign ||
      //   params.route === USER_INTERVENTION_METHODS.personal_sign ||
      //   params.route === USER_INTERVENTION_METHODS.eth_signTypedData ||
      //   params.route === USER_INTERVENTION_METHODS.eth_signTypedData_v4
      // ) {
      //   handlePersonalSign(message)
      // }
    }
  }, [approval, handleSendTransactions, handlePersonalSign])

  return {
    requests,
    resolveMany
  }
}

export default useSignApproval
