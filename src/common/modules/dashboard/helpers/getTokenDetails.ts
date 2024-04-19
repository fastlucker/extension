import { formatUnits } from 'ethers'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
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
  networks: NetworkDescriptor[]
) => {
  const isRewards = rewardsType === 'wallet-rewards'
  const isVesting = rewardsType === 'wallet-vesting'
  const networkData = networks.find(({ id }) => networkId === id)
  const postAmount = amountPostSimulation !== undefined ? amountPostSimulation : 0n
  const isPending = amountPostSimulation !== undefined && amountPostSimulation !== amount

  const balance = parseFloat(formatUnits(amount, decimals))
  const pendingBalance = isPending
    ? parseFloat(formatUnits(amountPostSimulation, decimals))
    : parseFloat('0')
  const priceUSD = priceIn.find(
    ({ baseCurrency }: { baseCurrency: string }) => baseCurrency.toLowerCase() === 'usd'
  )?.price
  const balanceUSD = priceUSD ? balance * priceUSD : undefined
  const pendingBalanceUSD = priceUSD && isPending ? pendingBalance * priceUSD : undefined
  const isBalanceIncrease = postAmount > amount
  const balanceChange = isBalanceIncrease ? postAmount - amount : amount - postAmount

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
