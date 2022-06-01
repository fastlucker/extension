import usePortfolio from '@modules/common/hooks/usePortfolio'

import TokenItem from './TokenItem'

const HiddenTokens = () => {
  const { hiddenTokens, onRemoveHiddenToken } = usePortfolio()

  const removeToken = (address) => {
    onRemoveHiddenToken(address)
  }

  return hiddenTokens.map((token) => (
    <TokenItem key={token.address} {...token} onPress={() => removeToken(token.address)} />
  ))
}

export default HiddenTokens
