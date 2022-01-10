import React from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import styles from './styles'

interface Props extends TouchableOpacityProps {
  text: string
}

const Button = ({ text, style = {}, disabled = false, ...rest }: Props) => (
  <TouchableOpacity
    disabled={disabled}
    style={[styles.button, disabled && styles.disabled, style]}
    {...rest}
  >
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
)

export default Button
