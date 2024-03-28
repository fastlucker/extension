import { formatUnits } from 'ethers'

import { TokenResult } from '@ambire-common/libs/portfolio'
import formatDecimals from '@common/utils/formatDecimals'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

const getTokenDetails = ({
  flags: { rewardsType },
  networkId,
  priceIn,
  amount,
  decimals
}: TokenResult) => {
  const isRewards = rewardsType === 'wallet-rewards'
  const isVesting = rewardsType === 'wallet-vesting'
  const { networks } = useSettingsControllerState()
  const networkData = networks.find(({ id }) => networkId === id)

  const balance = parseFloat(formatUnits(amount, decimals))
  const priceUSD = priceIn.find(
    ({ baseCurrency }: { baseCurrency: string }) => baseCurrency.toLowerCase() === 'usd'
  )?.price
  const balanceUSD = priceUSD ? balance * priceUSD : undefined

  return {
    balance,
    balanceFormatted: formatDecimals(balance, 'amount'),
    priceUSD,
    priceUSDFormatted: formatDecimals(priceUSD, 'price'),
    balanceUSD,
    balanceUSDFormatted: formatDecimals(balanceUSD, 'value'),
    networkData,
    isRewards,
    isVesting
  }
}

export default getTokenDetails
