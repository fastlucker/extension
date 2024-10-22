import { SocketAPIToken } from '@ambire-common/interfaces/swapAndBridge'
import { TokenResult } from '@ambire-common/libs/portfolio'

const getTokenDataFromId = (id: string) => {
  const [address, networkId, symbol, onGasTankString, rewardsType] = id.split('.')
  const onGasTank = onGasTankString === 'true'

  return [address, networkId, symbol, onGasTank, rewardsType]
}

const getTokenId = (token: SocketAPIToken | TokenResult) => {
  const socketAPIToken = token as SocketAPIToken
  if (!(socketAPIToken as any).networkId || !(socketAPIToken as any).flags)
    return `${token.address}.${token.symbol}`

  const portfolioToken = token as TokenResult
  const { onGasTank, rewardsType } = portfolioToken.flags

  return `${portfolioToken.address}.${portfolioToken.networkId}.${portfolioToken.symbol}.${String(
    onGasTank
  )}.${rewardsType || ''}`
}

export { getTokenDataFromId, getTokenId }
