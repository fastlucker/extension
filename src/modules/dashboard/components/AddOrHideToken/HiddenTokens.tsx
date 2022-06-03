import React from 'react'
import { View } from 'react-native'

import usePortfolio from '@modules/common/hooks/usePortfolio'
import spacings from '@modules/common/styles/spacings'

import { MODES } from './constants'
import TokenItem from './TokenItem'

interface Props {
  mode: MODES
}

const HiddenTokens: React.FC<Props> = ({ mode }) => {
  const { hiddenTokens, extraTokens, onRemoveHiddenToken, onRemoveExtraToken } = usePortfolio()

  const tokens = {
    [MODES.ADD_TOKEN]: extraTokens,
    [MODES.HIDE_TOKEN]: hiddenTokens
  }

  const onPressActions = {
    [MODES.ADD_TOKEN]: onRemoveExtraToken,
    [MODES.HIDE_TOKEN]: onRemoveHiddenToken
  }

  return (
    <View style={spacings.mt}>
      {tokens[mode].map((token) => (
        <TokenItem
          key={token.address}
          onPress={() => onPressActions[mode](token.address)}
          {...token}
        />
      ))}
    </View>
  )
}

export default HiddenTokens
