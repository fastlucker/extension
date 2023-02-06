import { useCallback, useEffect } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useStorage from '@modules/common/hooks/useStorage'

import { BROWSER_EXTENSION_REQUESTS_STORAGE_KEY, UseExtensionApprovalReturnType } from './types'

type Props = {
  approval: UseExtensionApprovalReturnType['approval']
  resolveApproval: UseExtensionApprovalReturnType['resolveApproval']
  rejectApproval: UseExtensionApprovalReturnType['rejectApproval']
}

const useSignApproval = ({ approval, resolveApproval, rejectApproval }: Props) => {
  const { selectedAcc: selectedAccount } = useAccounts()
  const { network } = useNetwork()
  const [requests, setRequests] = useStorage({
    key: BROWSER_EXTENSION_REQUESTS_STORAGE_KEY,
    defaultValue: [],
    setInit: (initialRequests) => (!Array.isArray(initialRequests) ? [] : initialRequests)
  })

  // handles eth_sign and personal_sign
  const handleSignText = useCallback(
    async (msg: any, method: string) => {
      if (!msg) {
        console.error('No msg request to sign', msg)
        return
      }
      const id = `ambex_${msg.id}`
      const messageToSign = msg?.[0]
      if (!messageToSign) {
        console.error('No msg request in received params')
        return
      }

      const request = {
        id,
        type: method,
        txn: messageToSign,
        chainId: network?.chainId,
        account: selectedAccount
      }

      // @ts-ignore
      setRequests((prevRequests) =>
        prevRequests.find((x: any) => x.id === request.id)
          ? prevRequests
          : [...prevRequests, request]
      )
    },
    [network?.chainId, selectedAccount, setRequests]
  )

  // handles eth_signTypedData, eth_signTypedData_v1, eth_signTypedData_v3 and eth_signTypedData_v4
  const handleSignTypedData = useCallback(
    async (msg: any, method: string) => {
      if (!msg) {
        console.error('No msg request to sign', msg)
        return
      }
      console.log('msg', msg)
      const id = `ambex_${msg.id}`
      const messageToSign = msg?.[1]
      if (!messageToSign) {
        console.error('No msg request in received params')
        return
      }

      const request = {
        id,
        type: method,
        txn: messageToSign,
        chainId: network?.chainId,
        account: selectedAccount
      }

      // @ts-ignore
      setRequests((prevRequests) =>
        prevRequests.find((x: any) => x.id === request.id)
          ? prevRequests
          : [...prevRequests, request]
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
        throw Error('No txs request in received params')
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
      for (const req of requests.filter((x: any) => ids.includes(x.id))) {
        // only process non batch or first batch req
        if (!req.isBatch || req.id.endsWith(':0')) {
          if (!resolution) {
            rejectApproval('Nothing to resolve')
          } else if (!resolution.success) {
            rejectApproval(resolution.message)
          } else {
            // onSuccess
            resolveApproval({
              hash: resolution.result
            })
          }
        }
      }
      // @ts-ignore
      setRequests((prevRequests) => prevRequests.filter((x) => !ids.includes(x.id)))
    },
    [requests, setRequests, rejectApproval, resolveApproval]
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

      if (method === 'personal_sign' || method === 'eth_sign') {
        handleSignText(params, method)
      }

      if (
        method === 'eth_signTypedData' ||
        method === 'eth_signTypedData_v1' ||
        method === 'eth_signTypedData_v3' ||
        method === 'eth_signTypedData_v4'
      ) {
        handleSignTypedData(params, method)
      }
    }
  }, [approval, handleSendTransactions, handleSignText, handleSignTypedData])

  return {
    requests,
    resolveMany
  }
}

export default useSignApproval
