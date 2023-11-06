import { formatUnits } from 'ethers'

import { TokenResult } from '@ambire-common/libs/portfolio'
import networks from '@common/constants/networks'

function formatThousands(input: string) {
  const parts = input.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

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
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0
  const balanceUSD = balance * priceUSD

  return {
    balance,
    balanceFormatted: formatThousands(balance.toFixed(balance < 1 ? 8 : 4)),
    priceUSD,
    priceUSDFormatted: formatThousands(priceUSD.toFixed(priceUSD < 1 ? 4 : 2)),
    balanceUSD,
    balanceUSDFormatted: formatThousands(balanceUSD.toFixed(balanceUSD < 1 ? 4 : 2)),
    networkData,
    isRewards,
    isVesting
  }
}

export default getTokenDetails
