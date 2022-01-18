// TODO: add types
import React, { createContext, useEffect, useMemo, useState } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePrevious from '@modules/common/hooks/usePrevious'
import useToast from '@modules/common/hooks/useToast'
import { navigate } from '@modules/common/services/navigation'

type RequestsContextData = {
  internalRequests: any
  addRequest: (req: any) => any
  sendTxnState: {
    showing: boolean
    [key: string]: any
  }
  prevSendTxnState: {
    showing: boolean
    [key: string]: any
  }
  eligibleRequests: any[]
  setSendTxnState: (sendTxnState: { showing: boolean }) => any
  onBroadcastedTxn: (hash: any) => void
  confirmSentTx: (txHash: any) => void
  resolveMany: (ids: any, resolution: any) => void
}

const RequestsContext = createContext<RequestsContextData>({
  internalRequests: [],
  addRequest: () => {},
  sendTxnState: {
    showing: false
  },
  prevSendTxnState: {
    showing: false
  },
  eligibleRequests: [],
  setSendTxnState: () => {},
  onBroadcastedTxn: () => {},
  confirmSentTx: () => {},
  resolveMany: () => {}
})

const RequestsProvider: React.FC = ({ children }) => {
  const { accounts, selectedAcc } = useAccounts()
  const { network }: any = useNetwork()
  const { addToast } = useToast()
  const [internalRequests, setInternalRequests] = useState<any>([])
  const [sentTxn, setSentTxn] = useState<any[]>([])

  const addRequest = (req: any) => setInternalRequests((reqs: any) => [...reqs, req])

  // Merge all requests
  // TODO: Add the rest of the requests -> [...internalRequests, ...wcRequests, ...gnosisRequests]
  const requests = useMemo(
    () =>
      [...internalRequests].filter(({ account }) => accounts.find(({ id }: any) => id === account)),
    [internalRequests, accounts]
  )

  // Show the send transaction full-screen modal if we have a new txn
  const eligibleRequests = useMemo(
    () =>
      requests.filter(
        ({ type, chainId, account }) =>
          type === 'eth_sendTransaction' && chainId === network.chainId && account === selectedAcc
      ),
    [requests, network?.chainId, selectedAcc]
  )

  const [sendTxnState, setSendTxnState] = useState<{
    showing: boolean
  }>(() => ({
    showing: !!eligibleRequests.length
  }))

  const prevSendTxnState: any = usePrevious(sendTxnState)

  useEffect(
    () => setSendTxnState({ showing: !!eligibleRequests.length }),
    [eligibleRequests.length]
  )

  const onBroadcastedTxn = (hash: any) => {
    if (!hash) {
      addToast('Transaction signed but not broadcasted to the network!', { timeout: 15000 })
      return
    }
    setSentTxn((txn: any) => [...txn, { confirmed: false, hash }])
    addToast('Transaction signed and sent successfully! &nbsp;Click to view on block explorer.', {
      onClick: () => navigate('transactions-tab'),
      timeout: 15000
    })
  }

  const confirmSentTx = (txHash: any) =>
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setSentTxn((sentTxn) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const tx = sentTxn.find((tx: any) => tx.hash === txHash)
      tx.confirmed = true
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return [...sentTxn.filter((tx: any) => tx.hash !== txHash), tx]
    })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolveMany = (ids: any, resolution: any) => {
    // TODO:
    // wcResolveMany(ids, resolution)
    // gnosisResolveMany(ids, resolution)
    setInternalRequests((reqs: any) => reqs.filter((x: any) => !ids.includes(x.id)))
  }

  useEffect(() => {
    if (sendTxnState.showing && !prevSendTxnState.showing) {
      navigate('pending-transactions')
    }
  }, [sendTxnState?.showing, prevSendTxnState?.showing])

  return (
    <RequestsContext.Provider
      value={useMemo(
        () => ({
          internalRequests,
          addRequest,
          sendTxnState,
          eligibleRequests,
          setSendTxnState,
          prevSendTxnState,
          onBroadcastedTxn,
          confirmSentTx,
          resolveMany
        }),
        [
          internalRequests,
          addRequest,
          sendTxnState,
          eligibleRequests,
          setSendTxnState,
          prevSendTxnState,
          onBroadcastedTxn,
          confirmSentTx,
          resolveMany
        ]
      )}
    >
      {children}
    </RequestsContext.Provider>
  )
}

export { RequestsContext, RequestsProvider }
