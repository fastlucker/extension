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
    amountPostSimulation
  }: TokenResult,
  networks: Network[]
) => {
  const isRewards = rewardsType === 'wallet-rewards'
  const isVesting = rewardsType === 'wallet-vesting'
  const networkData = networks.find(({ id }) => networkId === id)
  const amountish = BigInt(amount)
  const postAmount = typeof amountPostSimulation === 'bigint' ? amountPostSimulation : 0n
  const isPending = typeof amountPostSimulation === 'bigint' && amountPostSimulation !== amountish

  const balance = parseFloat(formatUnits(amountish, decimals))
  const pendingBalance = isPending
    ? parseFloat(formatUnits(amountPostSimulation, decimals))
    : parseFloat('0')
  const priceUSD = priceIn.find(
    ({ baseCurrency }: { baseCurrency: string }) => baseCurrency.toLowerCase() === 'usd'
  )?.price
  const balanceUSD = priceUSD ? balance * priceUSD : undefined
  const pendingBalanceUSD = priceUSD && isPending ? pendingBalance * priceUSD : undefined
  const isBalanceIncrease = postAmount > amountish
  const balanceChange = isBalanceIncrease ? postAmount - amountish : amountish - postAmount

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
    isBalanceIncrease,
    balanceChange: formatDecimals(parseFloat(formatUnits(balanceChange, decimals)), 'amount')
  }
}

export default getTokenDetails
