import { TokenResult } from '@ambire-common/libs/portfolio'

const getTokenDataFromId = (id: string) => {
  const [address, networkId, symbol, onGasTankString, rewardsType] = id.split('.')
  const onGasTank = onGasTankString === 'true'

  return [address, networkId, symbol, onGasTank, rewardsType]
}

const getTokenId = (token: TokenResult) => {
  const { onGasTank, rewardsType } = token.flags

  return `${token.address}.${token.networkId}.${token.symbol}.${String(onGasTank)}.${
    rewardsType || ''
  }`
}

export { getTokenDataFromId, getTokenId }
