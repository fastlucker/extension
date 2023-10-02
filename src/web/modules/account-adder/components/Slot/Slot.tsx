import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import colors from '@common/styles/colors'

import styles from './styles'

const Slot = ({ slot, children }: { slot: number; children: any }) => {
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
      <View>{children}</View>
    </View>
  )
}

export default React.memo(Slot)
