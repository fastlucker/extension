// TODO: add types
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useGnosisSafe from '@modules/common/hooks/useGnosis'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePrevious from '@modules/common/hooks/usePrevious'
import useToast from '@modules/common/hooks/useToast'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
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
  setSendTxnState: (sendTxnState: { showing: boolean; [key: string]: any }) => any
  onBroadcastedTxn: (hash: any) => void
  confirmSentTx: (txHash: any) => void
  resolveMany: (ids: any, resolution: any) => void
  everythingToSign: any[]
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
  resolveMany: () => {},
  everythingToSign: []
})

const RequestsProvider: React.FC = ({ children }) => {
  const { accounts, selectedAcc } = useAccounts()
  const { network }: any = useNetwork()
  const { requests: wcRequests, resolveMany: wcResolveMany } = useWalletConnect()
  const { requests: gnosisRequests, resolveMany: gnosisResolveMany } = useGnosisSafe()
  const { addToast } = useToast()
  const { t } = useTranslation()
  const [internalRequests, setInternalRequests] = useState<any>([])
  const [sentTxn, setSentTxn] = useState<any[]>([])

  const addRequest = (req: any) => setInternalRequests((reqs: any) => [...reqs, req])

  const requests = useMemo(
    () =>
      [...internalRequests, ...wcRequests, ...gnosisRequests].filter(({ account }) =>
        accounts.find(({ id }: any) => id === account)
      ),
    [internalRequests, wcRequests, accounts]
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
    [key: string]: any
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
      addToast(t('Transaction signed but not broadcasted to the network!') as string, {
        timeout: 15000
      })
      return
    }
    setSentTxn((txn: any) => [...txn, { confirmed: false, hash }])
    addToast(t('Transaction signed and sent successfully!') as string, {
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
    gnosisResolveMany(ids, resolution)
    wcResolveMany(ids, resolution)
    setInternalRequests((reqs: any) => reqs.filter((x: any) => !ids.includes(x.id)))
  }

  const everythingToSign = useMemo(
    () =>
      requests.filter(
        ({ type, account }) =>
          (type === 'personal_sign' || type === 'eth_sign') && account === selectedAcc
      ),
    [requests, selectedAcc]
  )

  useEffect(() => {
    if (everythingToSign.length) {
      navigate('sign-message')
    }
  }, [everythingToSign.length])

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
          resolveMany,
          everythingToSign
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
          resolveMany,
          everythingToSign
        ]
      )}
    >
      {children}
    </RequestsContext.Provider>
  )
}

export { RequestsContext, RequestsProvider }
