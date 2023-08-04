import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import colors from '@common/styles/colors'

import styles from './styles'

const Slot = ({ slot, isActive, children }: { slot: number; isActive: boolean; children: any }) => {
  const setSlotIndexLabelWidth = () => {
    if (slot <= 99) return 28
    if (slot > 99 && slot <= 999) return 36

    return 44
  }
  return (
    <View key={slot} style={styles.container}>
      <Text
        weight="semiBold"
        color={colors.martinique}
        style={{ width: setSlotIndexLabelWidth(), textAlign: 'center' }}
      >
        {slot}
      </Text>
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: isActive ? colors.violet : colors.prettyPosie
          }
        ]}
      />
      <View>{children}</View>
    </View>
  )
}

export default React.memo(Slot)
