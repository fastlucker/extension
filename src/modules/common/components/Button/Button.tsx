import React from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import styles from './styles'

interface Props extends TouchableOpacityProps {
  text: string
  type?: BUTTON_TYPES
}

export enum BUTTON_TYPES {
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}

const containerStyles = {
  [BUTTON_TYPES.PRIMARY]: styles.buttonContainerPrimary,
  [BUTTON_TYPES.SECONDARY]: styles.buttonContainerSecondary
}

const buttonTextStyles = {
  [BUTTON_TYPES.PRIMARY]: styles.buttonTextPrimary,
  [BUTTON_TYPES.SECONDARY]: styles.buttonTextSecondary
}

const Button = ({
  type = BUTTON_TYPES.PRIMARY,
  text,
  style = {},
  disabled = false,
  ...rest
}: Props) => (
  <TouchableOpacity
    disabled={disabled}
    style={[styles.buttonContainer, containerStyles[type], disabled && styles.disabled, style]}
    {...rest}
  >
    <Text style={[styles.buttonText, buttonTextStyles[type]]}>{text}</Text>
  </TouchableOpacity>
)

export default Button
