import { useMemo } from 'react'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import useCacheBreak from '@modules/common/hooks/useCacheBreak'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useRelayerData from '@modules/common/hooks/useRelayerData'

const relayerURL = CONFIG.RELAYER_URL

export default function useGasTankData() {
  const { cacheBreak } = useCacheBreak({})
  const { selectedAcc: account } = useAccounts()
  const { network } = useNetwork()
  const { tokens } = usePortfolio()

  const urlGetBalance = relayerURL
    ? `${relayerURL}/gas-tank/${account}/getBalance?cacheBreak=${cacheBreak}`
    : null
  const urlGetFeeAssets = relayerURL
    ? `${relayerURL}/gas-tank/assets?cacheBreak=${cacheBreak}`
    : null
  const urlGetTransactions = relayerURL
    ? `${relayerURL}/identity/${account}/${network?.id}/transactions`
    : null

  const { data, isLoading } = useRelayerData(urlGetBalance)
  const feeAssetsRes = useRelayerData(urlGetFeeAssets)
  const executedTxnsRes = useRelayerData(urlGetTransactions)

  const feeAssetsPerNetwork = useMemo(
    () => feeAssetsRes.data?.filter((item: any) => item.network === network?.id),
    [feeAssetsRes.data, network?.id]
  )

  const gasTankTxns = useMemo(
    () =>
      executedTxnsRes &&
      executedTxnsRes.data?.txns?.length &&
      executedTxnsRes.data?.txns?.filter((item: any) => !!item.gasTankFee),
    [executedTxnsRes]
  )

  const availableFeeAssets = useMemo(
    () =>
      feeAssetsPerNetwork?.map((item: any) => {
        const isFound = tokens?.find((x) => x.address.toLowerCase() === item.address.toLowerCase())
        if (isFound) return isFound
        return { ...item, balance: 0, balanceUSD: 0, decimals: 0 }
      }),
    [feeAssetsPerNetwork, tokens]
  )

  const sortedTokens = useMemo(
    () =>
      availableFeeAssets?.sort((a: any, b: any) => {
        const decreasing = b.balanceUSD - a.balanceUSD
        if (decreasing === 0) return a.symbol.localeCompare(b.symbol)
        return decreasing
      }),
    [availableFeeAssets]
  )

  return {
    data,
    isLoading,
    sortedTokens,
    gasTankTxns
  }
}
