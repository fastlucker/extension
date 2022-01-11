import ExpoCheckbox, { CheckboxProps } from 'expo-checkbox'
import React from 'react'
import { Text, View } from 'react-native'

import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

interface Props extends CheckboxProps {
  label?: string
  bottomSpacing?: number
}

export const CheckboxLabelStyle = styles.label

const Checkbox = ({ label, children, ...rest }: Props) => (
  <View style={styles.container}>
    <ExpoCheckbox
      style={styles.checkbox}
      color={rest.value ? colors.checkboxActiveColor : undefined}
      {...rest}
    />
    <View style={flexboxStyles.flex1}>
      {label ? <Text style={styles.label}>{label}</Text> : children}
    </View>
  </View>
)

export default Checkbox
