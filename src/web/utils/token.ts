import { SocketAPIToken } from '@ambire-common/interfaces/swapAndBridge'
import { TokenResult } from '@ambire-common/libs/portfolio'

const getTokenId = (token: SocketAPIToken | TokenResult) => {
  const socketAPIToken = token as SocketAPIToken
  if (!(socketAPIToken as any).chainId || !(socketAPIToken as any).flags)
    return `${token.address}.${token.symbol}`

  const portfolioToken = token as TokenResult
  const { onGasTank, rewardsType } = portfolioToken.flags

  return `${portfolioToken.address}.${portfolioToken.chainId}.${portfolioToken.symbol}.${String(
    onGasTank
  )}.${rewardsType || ''}`
}

export { getTokenId }
