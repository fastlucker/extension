import { formatUnits } from 'ethers'

import { Network } from '@ambire-common/interfaces/network'
import { TokenResult } from '@ambire-common/libs/portfolio'
import formatDecimals from '@common/utils/formatDecimals'

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
  networks: Network[]
) => {
  const isRewards = rewardsType === 'wallet-rewards'
  const isVesting = rewardsType === 'wallet-vesting'
  const networkData = networks.find(({ id }) => networkId === id)
  const amountish = BigInt(amount)
  const isPending = typeof amountPostSimulation === 'bigint' && amountPostSimulation !== amountish
  const simAmount = simulationAmount || 0n

  const balance = parseFloat(formatUnits(amountish, decimals))
  const pendingBalance = isPending
    ? parseFloat(formatUnits(amountPostSimulation, decimals))
    : parseFloat('0')
  const priceUSD = priceIn.find(
    ({ baseCurrency }: { baseCurrency: string }) => baseCurrency.toLowerCase() === 'usd'
  )?.price
  const balanceUSD = priceUSD ? balance * priceUSD : undefined
  const pendingBalanceUSD = priceUSD && isPending ? pendingBalance * priceUSD : undefined

  return {
    balance,
    balanceFormatted: formatDecimals(balance, 'amount'),
    pendingBalance,
    pendingBalanceFormatted: formatDecimals(pendingBalance, 'amount'),
    priceUSD,
    priceUSDFormatted: formatDecimals(priceUSD, 'price'),
    balanceUSD,
    balanceUSDFormatted: formatDecimals(balanceUSD, 'value'),
    pendingBalanceUSDFormatted: formatDecimals(pendingBalanceUSD, 'value'),
    networkData,
    isRewards,
    isVesting,
    balanceChange: formatDecimals(parseFloat(formatUnits(simAmount, decimals)), 'amount'),
    simAmount,
    // The UI badge logic is already implemented for the next two properties,
    // but the implementation for determining the pending-to-be-confirmed amount is still not done.
    // Once we figure out how we want to do it, we just need to pass the amount here.
    // @link: https://github.com/AmbireTech/ambire-app/issues/2162#issuecomment-2191731436
    pendingToBeConfirmed: 0n,
    pendingToBeConfirmedFormatted: formatDecimals(parseFloat(formatUnits(0n, decimals)), 'amount')
  }
}

export default getTokenDetails
