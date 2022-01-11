// TODO: add types
import React, { createContext, useEffect, useMemo, useState } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePrevious from '@modules/common/hooks/usePrevious'

type RequestsContextData = {
  internalRequests: any
  addRequest: (req: any) => any
  sendTxnState: {
    showing: boolean
  }
  prevSendTxnState: {
    showing: boolean
  }
  eligibleRequests: any[]
  setSendTxnState: (sendTxnState: { showing: boolean }) => any
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
  setSendTxnState: () => {}
})

const RequestsProvider: React.FC = ({ children }) => {
  const { accounts, selectedAcc } = useAccounts()
  const { network }: any = useNetwork()
  const [internalRequests, setInternalRequests] = useState<any>([])
  console.log('Internal requests: ', internalRequests)

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

  return (
    <RequestsContext.Provider
      value={useMemo(
        () => ({
          internalRequests,
          addRequest,
          sendTxnState,
          eligibleRequests,
          setSendTxnState,
          prevSendTxnState
        }),
        [
          internalRequests,
          addRequest,
          sendTxnState,
          eligibleRequests,
          setSendTxnState,
          prevSendTxnState
        ]
      )}
    >
      {children}
    </RequestsContext.Provider>
  )
}

export { RequestsContext, RequestsProvider }
