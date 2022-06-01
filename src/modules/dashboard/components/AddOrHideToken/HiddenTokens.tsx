import React from 'react'
import { View } from 'react-native'

import usePortfolio from '@modules/common/hooks/usePortfolio'
import spacings from '@modules/common/styles/spacings'

import TokenItem from './TokenItem'

const HiddenTokens = () => {
  const { hiddenTokens, onRemoveHiddenToken } = usePortfolio()

  const removeToken = (address) => {
    onRemoveHiddenToken(address)
  }

  return (
    <View style={spacings.mt}>
      {hiddenTokens.map((token) => (
        <TokenItem key={token.address} {...token} onPress={() => removeToken(token.address)} />
      ))}
    </View>
  )
}

export default HiddenTokens
