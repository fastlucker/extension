import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

const Slot = ({ slot, children }: { slot: number; children: any }) => {
  const { styles } = useTheme(getStyles)
  const setSlotIndexLabelWidth = () => {
    if (slot <= 99) return 28
    if (slot > 99 && slot <= 999) return 36

    return 44
  }
  return (
    <View key={slot} style={styles.container}>
      <Text weight="semiBold" style={{ width: setSlotIndexLabelWidth(), textAlign: 'center' }}>
        {slot}
      </Text>
      <View style={[styles.indicator]} />
      <View style={flexbox.flex1}>{children}</View>
    </View>
  )
}

export default React.memo(Slot)
