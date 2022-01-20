import { Bundle } from 'adex-protocol-eth/js'
// TODO: add types
import { useEffect, useState } from 'react'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'

// 10% in geth and most EVM chain RPCs
const RBF_THRESHOLD = 1.1

const useTransactions = () => {
  const { addToast } = useToast()
  const { selectedAcc } = useAccounts()
  const { setSendTxnState } = useRequests()
  const { network }: any = useNetwork()
  const [cacheBreak, setCacheBreak] = useState(() => Date.now())

  useEffect(() => {
    if (Date.now() - cacheBreak > 5000) setCacheBreak(Date.now())
    const intvl = setTimeout(() => setCacheBreak(Date.now()), 10000)
    return () => clearTimeout(intvl)
  }, [cacheBreak])

  const url = CONFIG.RELAYER_URL
    ? `${CONFIG.RELAYER_URL}/identity/${selectedAcc}/${network.id}/transactions?cacheBreak=${cacheBreak}`
    : null
  const { data, errMsg, isLoading } = useRelayerData(url)
  // @TODO: visualize other pending bundles
  const firstPending = data && data.txns?.find((x: any) => !x.executed && !x.replaced)

  const mapToBundle = (relayerBundle: any, extra = {}) =>
    new Bundle({
      ...relayerBundle,
      nonce: relayerBundle.nonce.num,
      gasLimit: null,
      // Instruct the relayer to abide by this minimum fee in USD per gas, to ensure we are truly replacing the txn
      minFeeInUSDPerGas: relayerBundle.feeInUSDPerGas * RBF_THRESHOLD,
      ...extra
    })

  const showSendTxns = (bundle: any) =>
    setSendTxnState({ showing: true, replacementBundle: bundle })

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
            'Transaction already picked up by the network, you will need to pay a fee to replace it with a cancellation transaction.'
          )
          cancelByReplacing(relayerBundle)
        } else {
          addToast('Transaction cancelled successfully')
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

  return {
    data,
    errMsg,
    isLoading,
    firstPending,
    speedup,
    cancel,
    showSendTxns
  }
}

export default useTransactions
