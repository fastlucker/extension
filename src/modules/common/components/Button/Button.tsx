import React from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import styles from './styles'

interface Props extends TouchableOpacityProps {
  text: string
}

const Button = ({ text, disabled = false, ...rest }: Props) => (
  <TouchableOpacity
    disabled={disabled}
    activeOpacity={disabled ? 1 : 0.8}
    style={styles.button}
    {...rest}
  >
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
)

export default Button
