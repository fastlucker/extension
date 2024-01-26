import React, { useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native'

import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

export interface InputProps extends TextInputProps {
  info?: string | boolean
  // Error message - Active if there is some error message string passed
  error?: string | boolean
  label?: string
  isValid?: boolean
  validLabel?: string
  button?: string | JSX.Element | null
  buttonProps?: TouchableOpacityProps
  onButtonPress?: () => void
  disabled?: boolean
  containerStyle?: ViewStyle | ViewStyle[]
  inputStyle?: ViewStyle | ViewStyle[]
  inputWrapperStyle?: ViewStyle | ViewStyle[]
  infoTextStyle?: TextStyle | TextStyle[]
  leftIcon?: () => JSX.Element | JSX.Element
}

const Input = ({
  label,
  button,
  buttonProps,
  info,
  error,
  isValid,
  validLabel,
  onBlur = () => {},
  onFocus = () => {},
  onButtonPress = () => {},
  disabled,
  containerStyle,
  inputStyle,
  inputWrapperStyle,
  infoTextStyle,
  leftIcon,
  ...rest
}: InputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const { theme, styles } = useTheme(getStyles)

  const handleOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (disabled) return
    setIsFocused(true)
    return onFocus(e)
  }
  const handleOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (disabled) return
    setIsFocused(false)
    return onBlur(e)
  }

  const hasButton = !!button

  const borderWrapperStyles = [
    styles.borderWrapper,
    !!error && { borderColor: theme.errorBackground },
    isFocused && { borderColor: theme.infoBackground },
    isValid && isFocused && { borderColor: theme.successBackground }
  ]

  const inputWrapperStyles = [
    styles.inputWrapper,
    {
      backgroundColor: theme.secondaryBackground,
      borderColor: theme.secondaryBorder
    },
    !!error && { borderColor: theme.errorDecorative },
    isFocused && { borderColor: theme.primary },
    isValid && !isFocused && { borderColor: theme.successDecorative },
    disabled && styles.disabled,
    inputWrapperStyle
  ]

  const inputStyles = [styles.input, !!hasButton && spacings.pr0, inputStyle]

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {!!label && (
        <Text appearance="secondaryText" fontSize={14} weight="regular" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={borderWrapperStyles}>
        <View style={inputWrapperStyles}>
          {!!leftIcon && <View style={styles.leftIcon}>{leftIcon()}</View>}
          {/* TextInput doesn't support border styles so we wrap it in a View */}
          <View style={[inputStyles, hasButton ? { width: '100%' } : {}]}>
            <TextInput
              placeholderTextColor={theme.secondaryText}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!disabled}
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
              {...rest}
              style={styles.nativeInput}
            />
          </View>
          {!!hasButton && (
            <TouchableOpacity
              // The `focusable` prop determines whether a component is user-focusable
              // and appears in the keyboard tab flow. It's missing in the
              // TouchableOpacity props, because it's react-native-web specific, see:
              // {@link https://necolas.github.io/react-native-web/docs/accessibility/#keyboard-focus}
              // @ts-ignore-next-line
              focusable={false}
              onPress={onButtonPress}
              disabled={disabled}
              style={styles.button}
              {...buttonProps}
            >
              {typeof button === 'string' || button instanceof String ? (
                <Text weight="medium">{button}</Text>
              ) : (
                button
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      {!!error && (
        <Text
          style={styles.errorText}
          weight={isWeb ? 'regular' : undefined}
          fontSize={10}
          appearance="errorText"
        >
          {error}
        </Text>
      )}

      {!!isValid && !!validLabel && !error && (
        <Text style={[styles.validText]} weight="regular" fontSize={12} color={colors.greenHaze}>
          {validLabel}
        </Text>
      )}

      {!!info && (
        <Text weight="regular" style={[styles.infoText, infoTextStyle]} fontSize={12}>
          {info}
        </Text>
      )}
    </View>
  )
}

export default React.memo(Input)
