import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

const Slot = ({
  slot,
  isLastItem,
  children
}: {
  slot: number
  isLastItem: boolean
  children: any
}) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()

  return (
    <View key={slot} style={[styles.container, isLastItem && spacings.mb0]}>
      <View style={styles.slotLabelWrapper}>
        <Text weight="medium" fontSize={14} style={styles.slotLabel}>
          {slot} {t('Slot')}
        </Text>
      </View>
      <View style={styles.itemsContainer}>{children}</View>
    </View>
  )
}

export default React.memo(Slot)
