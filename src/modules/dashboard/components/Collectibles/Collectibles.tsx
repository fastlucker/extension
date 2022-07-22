import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React from 'react'
import { View } from 'react-native'

import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'

import CollectiblesEmptyState from './CollectiblesEmptyState'
import styles from './styles'

interface Props {
  collectibles: UsePortfolioReturnType['collectibles']
}

const Collectibles = ({ collectibles }: Props) => {
  if (!collectibles?.length) {
    return <CollectiblesEmptyState />
  }

  return (
    <View style={spacings.pvLg}>
      <Text>Empty</Text>
    </View>
  )
}

export default Collectibles
