import React from 'react'
import { View } from 'react-native'
import ToggleSwitch from 'toggle-switch-react-native'

import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

import styles from './styles'

type Props = {
  isOn: boolean
  onToggle: (isOn: boolean) => void
  label?: string
}

const Toggle = ({ isOn, onToggle, label }: Props) => {
  return (
    <View style={styles.container}>
      {!!label && (
        <Text style={spacings.mrTy} color={isOn ? colors.heliotrope : colors.chetwode}>
          {label}
        </Text>
      )}
      <ToggleSwitch
        isOn={isOn}
        onToggle={onToggle}
        thumbOnStyle={styles.thumbOnStyle}
        thumbOffStyle={styles.thumbOffStyle}
        trackOnStyle={styles.trackOnStyle}
        trackOffStyle={styles.trackOffStyle}
        hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
      />
    </View>
  )
}

export default Toggle
