import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const CollectiblesEmptyState = () => {
  const { t } = useTranslation()
  return (
    <View
      style={[
        styles.itemsContainer,
        flexboxStyles.directionRow,
        flexboxStyles.alignCenter,
        spacings.mb
      ]}
    >
      <View style={[styles.item, flexboxStyles.flex1, flexboxStyles.alignCenter]}>
        <Text style={[spacings.phTy, textStyles.center]} fontSize={14}>
          {t("You don't have any collectables (NFTs) yet")}
        </Text>
      </View>
      <View style={[styles.item, styles.emptyStateItem]}>
        <Text fontSize={24} weight="regular">
          ?
        </Text>
      </View>
    </View>
  )
}

export default CollectiblesEmptyState
