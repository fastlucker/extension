import { formatUnits } from 'ethers'

import { TokenResult } from '@ambire-common/libs/portfolio'
import networks from '@common/constants/networks'
import formatDecimals from '@common/utils/formatDecimals'

const getTokenDetails = ({
  flags: { rewardsType },
  networkId,
  priceIn,
  amount,
  decimals
}: TokenResult) => {
  const isRewards = rewardsType === 'wallet-rewards'
  const isVesting = rewardsType === 'wallet-vesting'
  const networkData = networks.find(({ id }) => networkId === id)

  const balance = parseFloat(formatUnits(amount, decimals))
  const priceUSD =
    priceIn.find(
      ({ baseCurrency }: { baseCurrency: string }) => baseCurrency.toLowerCase() === 'usd'
    )?.price || 0
  const balanceUSD = balance * priceUSD

  return {
    balance,
    balanceFormatted: formatDecimals(balance, 'amount'),
    priceUSD,
    priceUSDFormatted: priceIn.length ? formatDecimals(priceUSD) : '-',
    balanceUSD,
    balanceUSDFormatted: priceIn.length ? formatDecimals(balanceUSD, 'value') : '-',
    networkData,
    isRewards,
    isVesting
  }
}

export default getTokenDetails
