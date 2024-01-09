import React from 'react'
import {
  Animated,
  ColorValue,
  Pressable,
  PressableProps,
  Text,
  TextStyle,
  ViewStyle
} from 'react-native'

import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

type ButtonTypes = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'

type ButtonSizes = 'regular' | 'small' | 'large'
export interface Props extends PressableProps {
  text?: string
  type?: ButtonTypes
  size?: ButtonSizes
  textStyle?: any
  accentColor?: ColorValue
  hasBottomSpacing?: boolean
  containerStyle?: PressableProps['style']
  disabledStyle?: ViewStyle
  children?: React.ReactNode
}

const Button = ({
  type = 'primary',
  size = 'regular',
  accentColor,
  text,
  style = {},
  textStyle = {},
  disabled = false,
  hasBottomSpacing = true,
  children,
  disabledStyle,
  ...rest
}: Props) => {
  const { styles, theme } = useTheme(getStyles)
  const animated = new Animated.Value(1)

  const fadeIn = () =>
    Animated.timing(animated, { toValue: 0.7, duration: 100, useNativeDriver: !isWeb }).start()
  const fadeOut = () =>
    Animated.timing(animated, { toValue: 1, duration: 200, useNativeDriver: !isWeb }).start()

  const containerStyles: { [key in ButtonTypes]: ViewStyle } = {
    primary: styles.buttonContainerPrimary,
    secondary: styles.buttonContainerSecondary,
    danger: styles.buttonContainerDanger,
    outline: styles.buttonContainerOutline,
    ghost: styles.buttonContainerGhost
  }

  const hoveredContainerStyles: { [key in ButtonTypes]: ViewStyle } = {
    primary: {
      backgroundColor: theme.primaryLight
    },
    // @TODO: add hover styles for other button types
    secondary: styles.buttonContainerSecondary,
    danger: styles.buttonContainerDanger,
    outline: styles.buttonContainerOutline,
    ghost: styles.buttonContainerGhost
  }

  const containerStylesSizes: { [key in ButtonSizes]: ViewStyle } = {
    large: styles.buttonContainerStylesSizeLarge,
    regular: styles.buttonContainerStylesSizeRegular,
    small: styles.buttonContainerStylesSizeSmall
  }

  const buttonTextStyles: { [key in ButtonTypes]: TextStyle } = {
    primary: styles.buttonTextPrimary,
    secondary: styles.buttonTextSecondary,
    danger: styles.buttonTextDanger,
    outline: styles.buttonTextOutline,
    ghost: styles.buttonTextGhost
  }

  const buttonTextStylesSizes: { [key in ButtonSizes]: TextStyle } = {
    large: styles.buttonTextStylesSizeLarge,
    regular: styles.buttonTextStylesSizeRegular,
    small: styles.buttonTextStylesSizeSmall
  }
  return (
    <Pressable
      disabled={disabled}
      style={({ hovered }: any) =>
        [
          containerStylesSizes[size],
          styles.buttonContainer,
          containerStyles[type],
          hovered ? hoveredContainerStyles[type] : {},
          style,
          !!accentColor && { borderColor: accentColor },
          !hasBottomSpacing && spacings.mb0,
          disabled && disabledStyle ? disabledStyle : {},
          disabled && !disabledStyle ? styles.disabled : {}
        ] as ViewStyle
      }
      // Animates all other components to mimic the TouchableOpacity effect
      onPressIn={type === 'primary' ? null : fadeIn}
      onPressOut={type === 'primary' ? null : fadeOut}
      {...rest}
    >
      {!!text && (
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
      )}
      {children}
    </Pressable>
  )
}

export default React.memo(Button)
