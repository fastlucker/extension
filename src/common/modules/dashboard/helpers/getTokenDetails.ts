import { formatUnits } from 'ethers'

import { Network } from '@ambire-common/interfaces/network'
import { TokenResult } from '@ambire-common/libs/portfolio'
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
  // TODO: TBD — when there’s an on-chain to-be-confirmed delta, the representation of Spendable and On-Chain amounts on the Dashboard seems unclear.
  //  In other scenarios, we display the token balance (pending amount, aka Spendable), On-Chain amount, and the corresponding badge.
  //  However, in this case, the Spendable and On-Chain amounts are identical, resulting in no visual distinction.
  //  We should discuss it from UX point of view the best way to handle this.
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

  const balance = parseFloat(formatUnits(amountish, decimals))
  const priceUSD = priceIn.find(
    ({ baseCurrency }: { baseCurrency: string }) => baseCurrency.toLowerCase() === 'usd'
  )?.price
  const balanceUSD = priceUSD ? balance * priceUSD : undefined

  const pendingAmounts =
    tokenAmаount?.latestAmount && tokenAmаount?.pendingAmount
      ? getPendingAmounts(
          tokenAmаount?.latestAmount,
          tokenAmаount?.pendingAmount,
          priceUSD!,
          decimals,
          amountPostSimulation,
          simulationAmount,
          lastKnownActivityNonce,
          lastKnownPortfolioNonce
        )
      : {}

  return {
    balance,
    balanceFormatted: formatDecimals(balance, 'amount'),
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
