import React from 'react'
import { ColorValue, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import spacings from '@modules/common/styles/spacings'

import styles from './styles'

interface Props extends TouchableOpacityProps {
  text: string
  type?: BUTTON_TYPES
  size?: BUTTON_SIZES
  accentColor?: ColorValue
  hasBottomSpacing?: boolean
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum BUTTON_TYPES {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger'
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum BUTTON_SIZES {
  SMALL = 'small',
  REGULAR = 'regular'
}

const containerStyles = {
  [BUTTON_TYPES.PRIMARY]: styles.buttonContainerPrimary,
  [BUTTON_TYPES.SECONDARY]: styles.buttonContainerSecondary,
  [BUTTON_TYPES.DANGER]: styles.buttonContainerDanger
}

const containerStylesSizes = {
  [BUTTON_SIZES.REGULAR]: styles.buttonContainerStylesSizeRegular,
  [BUTTON_SIZES.SMALL]: styles.buttonContainerStylesSizeSmall
}

const buttonTextStyles = {
  [BUTTON_TYPES.PRIMARY]: styles.buttonTextPrimary,
  [BUTTON_TYPES.SECONDARY]: styles.buttonTextSecondary,
  [BUTTON_TYPES.DANGER]: styles.buttonTextDanger
}

const buttonTextStylesSizes = {
  [BUTTON_SIZES.REGULAR]: styles.buttonTextStylesSizeRegular,
  [BUTTON_SIZES.SMALL]: styles.buttonTextStylesSizeSmall
}

const Button = ({
  type = BUTTON_TYPES.PRIMARY,
  size = BUTTON_SIZES.REGULAR,
  accentColor,
  text,
  style = {},
  disabled = false,
  hasBottomSpacing = true,
  ...rest
}: Props) => (
  <TouchableOpacity
    disabled={disabled}
    style={[
      styles.buttonContainer,
      containerStyles[type],
      containerStylesSizes[size],
      disabled && styles.disabled,
      style,
      !!accentColor && { borderColor: accentColor },
      !hasBottomSpacing && spacings.mb0
    ]}
    {...rest}
  >
    <Text
      style={[
        styles.buttonText,
        buttonTextStyles[type],
        buttonTextStylesSizes[size],
        !!accentColor && { color: accentColor }
      ]}
    >
      {text}
    </Text>
  </TouchableOpacity>
)

export default Button
