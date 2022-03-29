import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { ColorValue, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

import styles from './styles'

interface Props extends TouchableOpacityProps {
  text: string
  type?: BUTTON_TYPES
  size?: BUTTON_SIZES
  textStyle?: any
  accentColor?: ColorValue
  hasBottomSpacing?: boolean
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum BUTTON_TYPES {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger',
  OUTLINE = 'outline'
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum BUTTON_SIZES {
  SMALL = 'small',
  REGULAR = 'regular'
}

const containerStyles = {
  [BUTTON_TYPES.PRIMARY]: styles.buttonContainerPrimary,
  [BUTTON_TYPES.SECONDARY]: styles.buttonContainerSecondary,
  [BUTTON_TYPES.DANGER]: styles.buttonContainerDanger,
  [BUTTON_TYPES.OUTLINE]: styles.buttonContainerOutline
}

const containerStylesSizes = {
  [BUTTON_SIZES.REGULAR]: styles.buttonContainerStylesSizeRegular,
  [BUTTON_SIZES.SMALL]: styles.buttonContainerStylesSizeSmall
}

const noGradient = ['transparent', 'transparent']

const gradientColors = {
  [BUTTON_TYPES.PRIMARY]: [colors.violet, colors.heliotrope],
  [BUTTON_TYPES.SECONDARY]: noGradient,
  [BUTTON_TYPES.DANGER]: noGradient,
  [BUTTON_TYPES.OUTLINE]: noGradient
}

// Gradient colors applied when button is disabled
const gradientDisabledColors = {
  ...gradientColors,
  [BUTTON_TYPES.PRIMARY]: [colors.darkViolet, colors.violet]
}

const buttonTextStyles = {
  [BUTTON_TYPES.PRIMARY]: styles.buttonTextPrimary,
  [BUTTON_TYPES.SECONDARY]: styles.buttonTextSecondary,
  [BUTTON_TYPES.DANGER]: styles.buttonTextDanger,
  [BUTTON_TYPES.OUTLINE]: styles.buttonTextOutline
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
  textStyle = {},
  disabled = false,
  hasBottomSpacing = true,
  ...rest
}: Props) => (
  <TouchableOpacity disabled={disabled} style={styles.buttonWrapper} {...rest}>
    <LinearGradient
      colors={disabled ? gradientDisabledColors[type] : gradientColors[type]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        styles.buttonContainer,
        containerStyles[type],
        containerStylesSizes[size],
        disabled && styles.disabled,
        style,
        !!accentColor && { borderColor: accentColor },
        !hasBottomSpacing && spacings.mb0
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          buttonTextStyles[type],
          buttonTextStylesSizes[size],
          !!accentColor && { color: accentColor },
          textStyle
        ]}
      >
        {text}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
)

export default Button
