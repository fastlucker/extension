import ExpoCheckbox, { CheckboxProps } from 'expo-checkbox'
import React from 'react'
import { Text, View } from 'react-native'

import styles from './styles'

interface Props extends CheckboxProps {
  label?: string
  bottomSpacing?: number
}

export const CheckboxLabelStyle = styles.label

const Checkbox = ({ label, bottomSpacing = 16, children, ...rest }: Props) => (
  <View
    style={[
      styles.container,
      {
        marginBottom: bottomSpacing
      }
    ]}
  >
    <ExpoCheckbox style={styles.checkbox} {...rest} />
    {label ? <Text style={styles.label}>{label}</Text> : children}
  </View>
)

export default Checkbox
