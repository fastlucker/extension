import { formatUnits } from 'ethers'

import { Network } from '@ambire-common/interfaces/network'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { calculatePendingAmounts } from '@ambire-common/libs/portfolio/pendingAmountsHelper'
import formatDecimals from '@common/utils/formatDecimals'

// TODO: Determining the token's pending state (pending-to-be-signed or pending-to-be-confirmed) is quite complex,
//  with over six possible variations. We should thoroughly document all potential scenarios.
//  Additionally, creating unit tests for this function is highly recommended.
const getPendingAmounts = (
  latestAmount: bigint,
  pendingAmount: bigint,
  priceUSD: number,
  decimals: number,
  amountPostSimulation?: bigint,
  simulationDelta?: bigint, // pending delta (this is the amount of the simulation itself)
  activityNonce?: bigint,
  portfolioNonce?: bigint
) => {
  const onChainToBeConfirmedDelta = pendingAmount - latestAmount

  // There is no Pending state changes
  if (onChainToBeConfirmedDelta === 0n && !simulationDelta) return {}

  let pendingBalance

  if (onChainToBeConfirmedDelta && !amountPostSimulation) {
    pendingBalance = parseFloat(formatUnits(pendingAmount, decimals))
  } else {
    pendingBalance = parseFloat(formatUnits(amountPostSimulation!, decimals))
  }

  const pendingBalanceUSD = priceUSD && pendingBalance ? pendingBalance * priceUSD : undefined

  const result: any = {
    isPending: true,
    pendingBalance,
    pendingBalanceFormatted: formatDecimals(pendingBalance, 'amount'),
    pendingBalanceUSD,
    pendingBalanceUSDFormatted: formatDecimals(pendingBalanceUSD, 'value')
  }

  if (simulationDelta) {
    const hasPendingToBeConfirmed = activityNonce && activityNonce === portfolioNonce

    if (hasPendingToBeConfirmed) {
      result.pendingToBeConfirmed = simulationDelta
      result.pendingToBeConfirmedFormatted = formatDecimals(
        parseFloat(formatUnits(simulationDelta, decimals)),
        'amount'
      )
    } else {
      result.pendingToBeSigned = simulationDelta
      result.pendingToBeSignedFormatted = formatDecimals(
        parseFloat(formatUnits(simulationDelta, decimals)),
        'amount'
      )
    }
  }

  if (onChainToBeConfirmedDelta) {
    // TODO: the first condition is the biggest corner case we could have, but we should manually test if everything is good.
    const pendingToBeConfirmed = result.pendingToBeConfirmed
      ? result.pendingToBeConfirmed + onChainToBeConfirmedDelta
      : onChainToBeConfirmedDelta
    result.pendingToBeConfirmed = pendingToBeConfirmed
    result.pendingToBeConfirmedFormatted = formatDecimals(
      parseFloat(formatUnits(pendingToBeConfirmed, decimals)),
      'amount'
    )
  }

  return result
}

const formatPendingAmounts = (pendingAmounts, decimals) => {
  return {
    ...pendingAmounts,
    pendingBalanceFormatted: formatDecimals(pendingAmounts.pendingBalance, 'amount'),
    pendingBalanceUSDFormatted: formatDecimals(pendingAmounts.pendingBalanceUSD, 'value'),
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
  lastKnownActivityNonce?: bigint,
  lastKnownPortfolioNonce?: bigint,
  tokenAmаount?: {
    latestAmount: bigint
    pendingAmount: bigint
    address: string
    networkId: string
  }
) => {
  const isRewards = rewardsType === 'wallet-rewards'
  const isVesting = rewardsType === 'wallet-vesting'
  const networkData = networks.find(({ id }) => networkId === id)
  const amountish = BigInt(amount)
  const amountishLatest = BigInt(tokenAmаount?.latestAmount || 0n)

  const balance = parseFloat(formatUnits(amountish, decimals))
  const balanceLatest = parseFloat(formatUnits(amountishLatest, decimals))
  const priceUSD = priceIn.find(
    ({ baseCurrency }: { baseCurrency: string }) => baseCurrency.toLowerCase() === 'usd'
  )?.price
  const balanceUSD = priceUSD ? balance * priceUSD : undefined

  const pendingAmounts = tokenAmаount?.address
    ? formatPendingAmounts(
        calculatePendingAmounts(
          tokenAmаount?.latestAmount,
          tokenAmаount?.pendingAmount,
          priceUSD!,
          decimals,
          amountPostSimulation,
          simulationAmount,
          lastKnownActivityNonce,
          lastKnownPortfolioNonce
        ),
        decimals
      )
    : {}

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
    ...pendingAmounts
  }
}

export default getTokenDetails
