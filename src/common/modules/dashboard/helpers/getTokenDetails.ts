import { formatUnits } from 'ethers'

import { Network } from '@ambire-common/interfaces/network'
import { TokenResult } from '@ambire-common/libs/portfolio'
import {
  calculatePendingAmounts,
  PendingAmounts
} from '@ambire-common/libs/portfolio/pendingAmountsHelper'
import formatDecimals from '@common/utils/formatDecimals'

const formatPendingAmounts = (
  pendingAmounts: PendingAmounts | undefined,
  decimals: number,
  priceUSD: number
) => {
  if (!pendingAmounts) return undefined

  const pendingBalance = parseFloat(formatUnits(pendingAmounts.pendingBalance, decimals))
  const pendingBalanceUSD = priceUSD && pendingBalance ? pendingBalance * priceUSD : undefined

  return {
    ...pendingAmounts,
    pendingBalanceFormatted: formatDecimals(pendingBalance, 'amount'),
    pendingBalanceUSDFormatted: formatDecimals(pendingBalanceUSD, 'value'),
    ...(pendingAmounts.pendingToBeSigned
      ? {
          pendingToBeSignedFormatted: formatDecimals(
            parseFloat(formatUnits(pendingAmounts.pendingToBeSigned, decimals)),
            'amount'
          )
        }
      : {}),
    ...(pendingAmounts.pendingToBeConfirmed
      ? {
          pendingToBeConfirmedFormatted: formatDecimals(
            parseFloat(formatUnits(pendingAmounts.pendingToBeConfirmed, decimals)),
            'amount'
          )
        }
      : {})
  }
}

const getTokenDetails = (
  {
    flags: { rewardsType },
    networkId,
    priceIn,
    amount,
    decimals,
    amountPostSimulation,
    simulationAmount
  }: TokenResult,
  networks: Network[],
  tokenAmounts?: {
    latestAmount: bigint
    pendingAmount: bigint
    address: string
    networkId: string
  },
  lastKnownActivityNonce?: bigint,
  lastKnownPortfolioNonce?: bigint
) => {
  const isRewards = rewardsType === 'wallet-rewards'
  const isVesting = rewardsType === 'wallet-vesting'
  const networkData = networks.find(({ id }) => networkId === id)
  const amountish = BigInt(amount)
  const amountishLatest = BigInt(tokenAmounts?.latestAmount || 0n)

  const balance = parseFloat(formatUnits(amountish, decimals))
  const balanceLatest = parseFloat(formatUnits(amountishLatest, decimals))
  const priceUSD = priceIn.find(
    ({ baseCurrency }: { baseCurrency: string }) => baseCurrency.toLowerCase() === 'usd'
  )?.price
  const balanceUSD = priceUSD ? balance * priceUSD : undefined

  const pendingAmountsFormatted = formatPendingAmounts(
    tokenAmounts?.address
      ? calculatePendingAmounts(
          tokenAmounts?.latestAmount,
          tokenAmounts?.pendingAmount,
          amountPostSimulation,
          simulationAmount,
          lastKnownActivityNonce,
          lastKnownPortfolioNonce
        )
      : undefined,
    decimals,
    priceUSD!
  )

  return {
    balance,
    balanceFormatted: formatDecimals(balance, 'amount'),
    balanceLatestFormatted: formatDecimals(balanceLatest, 'amount'),
    priceUSD,
    priceUSDFormatted: formatDecimals(priceUSD, 'price'),
    balanceUSD,
    balanceUSDFormatted: formatDecimals(balanceUSD, 'value'),
    networkData,
    isRewards,
    isVesting,
    ...pendingAmountsFormatted
  }
}

export default getTokenDetails
