import React from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import styles from './styles'

interface Props extends TouchableOpacityProps {
  text: string
  type?: BUTTON_TYPES
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum BUTTON_TYPES {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger'
}

const containerStyles = {
  [BUTTON_TYPES.PRIMARY]: styles.buttonContainerPrimary,
  [BUTTON_TYPES.SECONDARY]: styles.buttonContainerSecondary,
  [BUTTON_TYPES.DANGER]: styles.buttonContainerDanger
}

const buttonTextStyles = {
  [BUTTON_TYPES.PRIMARY]: styles.buttonTextPrimary,
  [BUTTON_TYPES.SECONDARY]: styles.buttonTextSecondary,
  [BUTTON_TYPES.DANGER]: styles.buttonTextDanger
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
