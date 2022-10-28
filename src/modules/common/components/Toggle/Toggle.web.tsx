// TODO: implement a toggle switch on web
import React from 'react'
import { View } from 'react-native'

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
      <Text>Here should be a toggle switch for web</Text>
    </View>
  )
}

export default Toggle
