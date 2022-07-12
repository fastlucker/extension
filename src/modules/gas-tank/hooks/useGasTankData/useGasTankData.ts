import useCacheBreak from 'ambire-common/src/hooks/useCacheBreak'
import { useMemo } from 'react'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import { getGasTankFilledTxns } from '@modules/common/services/isFeeCollectorTxn'
import { getAddedGas } from '@modules/pending-transactions/services/helpers'

const relayerURL = CONFIG.RELAYER_URL

export default function useGasTankData() {
  const { cacheBreak } = useCacheBreak()
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

  const { data: balancesRes, isLoading } = useRelayerData(urlGetBalance)
  const { data: feeAssetsRes } = useRelayerData(urlGetFeeAssets)
  const { data: executedTxnsRes } = useRelayerData(urlGetTransactions)

  const gasTankBalances = useMemo(
    () =>
      balancesRes &&
      balancesRes.length &&
      balancesRes.map(({ balanceInUSD }: any) => balanceInUSD).reduce((a: any, b: any) => a + b, 0),
    [balancesRes]
  )

  const gasTankTxns = useMemo(
    () =>
      executedTxnsRes &&
      executedTxnsRes.txns.length &&
      executedTxnsRes.txns.filter((item: any) => !!item.gasTankFee),
    [executedTxnsRes]
  )

  const feeAssetsPerNetwork = useMemo(
    () =>
      feeAssetsRes &&
      feeAssetsRes.length &&
      feeAssetsRes.filter((item: any) => item.network === network?.id),
    [feeAssetsRes, network?.id]
  )

  const executedTxns = executedTxnsRes && executedTxnsRes.txns.length && executedTxnsRes.txns
  const gasTankFilledTxns = useMemo(
    () => executedTxns && executedTxns.length && getGasTankFilledTxns(executedTxns),
    [executedTxns]
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

  const totalSavedResult = useMemo(
    () =>
      gasTankTxns &&
      gasTankTxns.length &&
      gasTankTxns
        .map((item: any) => {
          const feeTokenDetails = feeAssetsRes
            ? feeAssetsRes.find((i: any) => i.symbol === item.feeToken)
            : null
          const savedGas = feeTokenDetails ? getAddedGas(feeTokenDetails) : null
          return savedGas ? item.feeInUSDPerGas * savedGas : 0.0
        })
        .reduce((a: any, b: any) => a + b),
    [feeAssetsRes, gasTankTxns]
  )

  return {
    balancesRes,
    gasTankBalances,
    isLoading,
    sortedTokens,
    gasTankTxns,
    feeAssetsRes,
    gasTankFilledTxns,
    totalSavedResult
  }
}
