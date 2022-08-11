import { Bundle } from 'adex-protocol-eth/js'
import useCacheBreak from 'ambire-common/src/hooks/useCacheBreak'
// TODO: add types
import { useCallback } from 'react'

import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'

// 10% in geth and most EVM chain RPCs; relayer wants 12%
const RBF_THRESHOLD = 1.14

const useTransactions = () => {
  const { addToast } = useToast()
  const { selectedAcc } = useAccounts()
  const { setSendTxnState } = useRequests()
  const { network }: any = useNetwork()
  const { t } = useTranslation()
  const { addRequest } = useRequests()
  const { cacheBreak } = useCacheBreak({
    breakPoint: 5000,
    refreshInterval: 10000
  })

  const showSendTxns = (bundle: any) =>
    setSendTxnState({ showing: true, replacementBundle: bundle })

  const showSendTxnsForReplacement = useCallback(
    (bundle) => {
      bundle.txns.slice(0, -1).forEach((txn: any, index: any) => {
        addRequest({
          id: index,
          chainId: network.chainId,
          account: selectedAcc,
          type: 'eth_sendTransaction',
          txn: {
            to: txn[0].toLowerCase(),
            value: txn[1] === '0x' ? '0x0' : txn[1],
            data: txn[2]
          }
        })
      })
      // Wouldn't need to be called cause it will happen autoamtically, except we need `replaceByDefault`
      setSendTxnState({ showing: true, replaceByDefault: true })
    },
    [addRequest, network, selectedAcc, setSendTxnState]
  )

  const url = CONFIG.RELAYER_URL
    ? `${CONFIG.RELAYER_URL}/identity/${selectedAcc}/${network.id}/transactions?cacheBreak=${cacheBreak}`
    : null
  const { data, errMsg, isLoading, forceRefresh } = useRelayerData({ url })
  const urlGetFeeAssets = CONFIG.RELAYER_URL
    ? `${CONFIG.RELAYER_URL}/gas-tank/assets?cacheBreak=${cacheBreak}`
    : null
  const { data: feeAssets } = useRelayerData({ url: urlGetFeeAssets })

  // @TODO: visualize other pending bundles
  const allPending = data && data.txns.filter((x: any) => !x.executed && !x.replaced)
  const firstPending = allPending && allPending[0]

  const mapToBundle = (relayerBundle: any, extra = {}) =>
    new Bundle({
      ...relayerBundle,
      nonce: relayerBundle.nonce.num,
      gasLimit: null,
      // Instruct the relayer to abide by this minimum fee in USD per gas, to ensure we are truly replacing the txn
      minFeeInUSDPerGas: relayerBundle.feeInUSDPerGas * RBF_THRESHOLD,
      ...extra
    })

  const cancelByReplacing = (relayerBundle: any) =>
    showSendTxns(
      mapToBundle(relayerBundle, {
        txns: [[selectedAcc, '0x0', '0x']]
      })
    )

  const cancel = (relayerBundle: any) => {
    // @TODO relayerless
    mapToBundle(relayerBundle)
      .cancel({ relayerURL: CONFIG.RELAYER_URL, fetch })
      .then(({ success }: any) => {
        if (!success) {
          addToast(
            t(
              'Transaction already picked up by the network, you will need to pay a fee to replace it with a cancellation transaction.'
            ) as string
          )
          cancelByReplacing(relayerBundle)
        } else {
          addToast(t('Transaction cancelled successfully') as string)
        }
      })
      .catch((e: any) => {
        console.error(e)
        cancelByReplacing(relayerBundle)
      })
  }

  // @TODO: we are currently assuming the last txn is a fee; change that (detect it)
  const speedup = (relayerBundle: any) =>
    showSendTxns(mapToBundle(relayerBundle, { txns: relayerBundle.txns.slice(0, -1) }))

  const replace = (relayerBundle: any) => showSendTxnsForReplacement(mapToBundle(relayerBundle))

  return {
    data,
    feeAssets,
    errMsg,
    isLoading,
    firstPending,
    speedup,
    replace,
    cancel,
    showSendTxns,
    forceRefresh
  }
}

export default useTransactions
