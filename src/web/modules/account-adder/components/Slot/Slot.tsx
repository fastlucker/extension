import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import colors from '@common/styles/colors'

import styles from './styles'

const Slot = ({ slot, children }: { slot: number; children: any }) => {
  return (
    <View key={slot} style={styles.container}>
      <Text weight="semiBold" color={colors.martinique} style={{ width: 30, textAlign: 'center' }}>
        {slot}
      </Text>
      <View style={styles.indicator} />
      <View>{children}</View>
    </View>
  )
}

export default React.memo(Slot)
