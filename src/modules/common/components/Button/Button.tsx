import React from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import styles from './styles'

interface Props extends TouchableOpacityProps {
  text: string
}

const Button = ({ text, ...rest }: Props) => (
  <TouchableOpacity style={styles.button} {...rest}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
)

export default Button
