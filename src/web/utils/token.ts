import { Network } from '@ambire-common/interfaces/network'
import { SwapAndBridgeToToken } from '@ambire-common/interfaces/swapAndBridge'
import { TokenResult } from '@ambire-common/libs/portfolio'

const getTokenId = (token: SwapAndBridgeToToken | TokenResult, networks: Network[] = []) => {
  const socketAPIToken = token as SwapAndBridgeToToken
  if (!(socketAPIToken as any).chainId || !(socketAPIToken as any).flags)
    return `${token.address}.${token.symbol}`

  const portfolioToken = token as TokenResult
  const { onGasTank, rewardsType } = portfolioToken.flags
  const network = networks.find((n) => n.chainId === portfolioToken.chainId)

  return `${portfolioToken.address}.${portfolioToken.chainId}.${portfolioToken.symbol}.${String(
    onGasTank
  )}.${rewardsType || ''}.${network?.name || ''}`
}

export { getTokenId }
