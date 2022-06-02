import React from 'react'
import { View } from 'react-native'

import usePortfolio from '@modules/common/hooks/usePortfolio'
import spacings from '@modules/common/styles/spacings'

import TokenItem from './TokenItem'

const HiddenTokens = () => {
  const { hiddenTokens, onRemoveHiddenToken } = usePortfolio()

  return (
    <View style={spacings.mt}>
      {hiddenTokens.map((token) => (
        <TokenItem
          key={token.address}
          onPress={() => onRemoveHiddenToken(token.address)}
          {...token}
        />
      ))}
    </View>
  )
}

export default HiddenTokens
