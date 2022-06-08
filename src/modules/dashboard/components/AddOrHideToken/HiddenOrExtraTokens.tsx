import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React from 'react'
import { View } from 'react-native'

import spacings from '@modules/common/styles/spacings'

import { MODES } from './constants'
import TokenItem from './TokenItem'

interface Props {
  mode: MODES
  extraTokens: UsePortfolioReturnType['extraTokens']
  hiddenTokens: UsePortfolioReturnType['hiddenTokens']
  onRemoveExtraToken: UsePortfolioReturnType['onRemoveExtraToken']
  onRemoveHiddenToken: UsePortfolioReturnType['onRemoveHiddenToken']
}

const HiddenOrExtraTokens: React.FC<Props> = ({
  mode,
  extraTokens,
  hiddenTokens,
  onRemoveExtraToken,
  onRemoveHiddenToken
}: Props) => {
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

export default React.memo(HiddenOrExtraTokens)
