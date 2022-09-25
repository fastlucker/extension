// TODO: fill in the missing types
import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useAmbireExtension from '@modules/common/hooks/useAmbireExtension'
import useGnosisSafe from '@modules/common/hooks/useGnosis'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
import { navigate } from '@modules/common/services/navigation'

export interface RequestsContextReturnType {
  internalRequests: any
  sendTxnState: {
    showing: boolean
    [key: string]: any
  }
  prevSendTxnState: {
    showing: boolean
    [key: string]: any
  }
  eligibleRequests: any[]
  everythingToSign: any[]
  setSendTxnState: (sendTxnState: { showing: boolean; [key: string]: any }) => any
  addRequest: (req: any) => any
  onBroadcastedTxn: (hash: any) => void
  confirmSentTx: (txHash: any) => void
  resolveMany: (ids: any, resolution: any) => void
  showSendTxns: (replacementBundle: any, replaceByDefault?: boolean) => void
  onDismissSendTxns: () => void
}

const RequestsContext = createContext<RequestsContextReturnType>({
  internalRequests: [],
  sendTxnState: {
    showing: false
  },
  prevSendTxnState: {
    showing: false
  },
  eligibleRequests: [],
  everythingToSign: [],
  setSendTxnState: () => {},
  addRequest: () => {},
  onBroadcastedTxn: () => {},
  confirmSentTx: () => {},
  resolveMany: () => {},
  showSendTxns: () => {},
  onDismissSendTxns: () => {}
})

const RequestsProvider: React.FC = ({ children }) => {
  const { accounts, selectedAcc } = useAccounts()
  const { network }: any = useNetwork()
  const { requests: wcRequests, resolveMany: wcResolveMany } = useWalletConnect()
  const { requests: gnosisRequests, resolveMany: gnosisResolveMany } = useGnosisSafe()
  const { requests: ambireExtensionRequests, resolveMany: ambireExtensionResolveMany } =
    useAmbireExtension()
  const { addToast } = useToast()
  const { t } = useTranslation()
  const [internalRequests, setInternalRequests] = useState<any>([])
  // Keeping track of sent transactions
  const [sentTxn, setSentTxn] = useState<any[]>([])

  const addRequest = useCallback(
    (req: any) => setInternalRequests((reqs: any) => [...reqs, req]),
    []
  )

  const requests = useMemo(
    () =>
      [...internalRequests, ...wcRequests, ...gnosisRequests, ...ambireExtensionRequests].filter(
        ({ account }) => accounts.find(({ id }: any) => id === account)
      ),
    [internalRequests, wcRequests, gnosisRequests, ambireExtensionRequests, accounts]
  )

  // Handling transaction signing requests
  // Show the send transaction full-screen modal if we have a new txn
  const eligibleRequests = useMemo(
    () =>
      requests.filter(
        ({ type, chainId, account }) =>
          type === 'eth_sendTransaction' && chainId === network.chainId && account === selectedAcc
      ),
    [requests, network?.chainId, selectedAcc]
  )
  // Docs: the state is { showing: bool, replacementBundle, replaceByDefault: bool, mustReplaceNonce: number }
  // mustReplaceNonce is set when the end goal is to replace a particular transaction, and if that txn gets mined we should stop the user from doing anything
  // mustReplaceNonce must always be used together with either replaceByDefault: true or replacementBundle
  const [sendTxnState, setSendTxnState] = useState<{
    showing: boolean
    [key: string]: any
  }>(() => ({
    showing: !!eligibleRequests.length
  }))

  const prevSendTxnState: any = usePrevious(sendTxnState)

  useEffect(() => {
    setSendTxnState((prev) => ({
      showing: !!eligibleRequests.length,
      // we only keep those if there are transactions, otherwise zero them
      replaceByDefault: eligibleRequests.length ? prev.replaceByDefault : null,
      mustReplaceNonce: eligibleRequests.length ? prev.mustReplaceNonce : null
    }))
  }, [eligibleRequests.length])

  const onBroadcastedTxn = useCallback(
    (hash: any) => {
      if (!hash) {
        addToast(t('Transaction signed but not broadcasted to the network!') as string, {
          timeout: 15000
        })
        return
      }
      setSentTxn((txn: any) => [...txn, { confirmed: false, hash }])
      addToast(t('Transaction signed and sent successfully!') as string, {
        onClick: () => navigate('transactions'),
        timeout: 15000
      })
    },
    [addToast, t]
  )

  const confirmSentTx = useCallback(
    (txHash: any) =>
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setSentTxn((sentTxn) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const tx = sentTxn.find((tx: any) => tx.hash === txHash)
        tx.confirmed = true
        // eslint-disable-next-line @typescript-eslint/no-shadow
        return [...sentTxn.filter((tx: any) => tx.hash !== txHash), tx]
      }),
    []
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolveMany = useCallback(
    (ids: any, resolution: any) => {
      gnosisResolveMany(ids, resolution)
      wcResolveMany(ids, resolution)
      ambireExtensionResolveMany(ids, resolution)
      setInternalRequests((reqs: any) => reqs.filter((x: any) => !ids.includes(x.id)))
    },
    [gnosisResolveMany, wcResolveMany, ambireExtensionResolveMany]
  )

  const showSendTxns = useCallback(
    (replacementBundle: any, replaceByDefault = false) =>
      setSendTxnState({ showing: true, replacementBundle, replaceByDefault }),
    [setSendTxnState]
  )
  // keep values such as replaceByDefault and mustReplaceNonce; those will be reset on any setSendTxnState/showSendTxns
  // we DONT want to keep replacementBundle - closing the dialog means you've essentially dismissed it
  // also, if you used to be on a replacementBundle, we DON'T want to keep those props
  const onDismissSendTxns = useCallback(
    () =>
      setSendTxnState((prev) =>
        prev.replacementBundle
          ? { showing: false }
          : {
              showing: false,
              replaceByDefault: prev.replaceByDefault,
              mustReplaceNonce: prev.mustReplaceNonce
            }
      ),
    [setSendTxnState]
  )

  // Handling message signatures
  // Network shouldn't matter here
  const everythingToSign = useMemo(
    () =>
      requests.filter(
        ({ type, account }) =>
          (type === 'personal_sign' ||
            type === 'eth_sign' ||
            type === 'eth_signTypedData_v4' ||
            type === 'eth_signTypedData') &&
          account === selectedAcc
      ),
    [requests, selectedAcc]
  )

  useEffect(() => {
    if (everythingToSign.length) {
      navigate('sign-message')
    }
  }, [everythingToSign.length])

  useEffect(() => {
    if (sendTxnState?.showing && !prevSendTxnState?.showing) {
      navigate('pending-transactions')
    }
  }, [sendTxnState?.showing, prevSendTxnState?.showing])

  return (
    <RequestsContext.Provider
      value={useMemo(
        () => ({
          internalRequests,
          sendTxnState,
          eligibleRequests,
          everythingToSign,
          prevSendTxnState,
          setSendTxnState,
          addRequest,
          onBroadcastedTxn,
          confirmSentTx,
          resolveMany,
          showSendTxns,
          onDismissSendTxns
        }),
        [
          internalRequests,
          sendTxnState,
          eligibleRequests,
          everythingToSign,
          prevSendTxnState,
          setSendTxnState,
          addRequest,
          onBroadcastedTxn,
          confirmSentTx,
          resolveMany,
          showSendTxns,
          onDismissSendTxns
        ]
      )}
    >
      {children}
    </RequestsContext.Provider>
  )
}

export { RequestsContext, RequestsProvider }
