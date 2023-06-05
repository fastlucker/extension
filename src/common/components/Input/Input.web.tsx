import React, { useState, InputHTMLAttributes } from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

import styles from './styles'

export interface InputProps extends InputHTMLAttributes {
  info?: string | boolean
  type?: string
  // Error message - Active if there is some error message string passed
  error?: string | boolean
  label?: string
  isValid?: boolean
  validLabel?: string
  button?: string | JSX.Element
  buttonProps?: TouchableOpacityProps
  onButtonPress?: () => void
  onBlur?: (e: React.ChangeEventHandler<HTMLInputElement>) => void
  onFocus?: (e: React.ChangeEventHandler<HTMLInputElement>) => void
  onChangeText?: () => void
  disabled?: boolean
  containerStyle?: any
  infoTextStyle?: any
  leftIcon?: () => JSX.Element | JSX.Element
}

const Input = ({
  type = 'text',
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
  infoTextStyle,
  leftIcon,
  onChangeText,
  ...rest
}: InputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const { theme } = useTheme()

  const handleOnFocus = (e: React.ChangeEventHandler<HTMLInputElement>) => {
    setIsFocused(true)
    return onFocus(e)
  }
  const handleOnBlur = (e: React.ChangeEventHandler<HTMLInputElement>) => {
    setIsFocused(false)
    return onBlur(e)
  }

  const hasButton = !!button

  const inputStyles = {
    ...styles.input,
    ...{
      backgroundColor: theme.inputBackground,
      borderBottomColor: theme.inputBorder
    },
    ...(isWeb && { borderColor: theme.inputBorder }),
    ...(!!error && { borderBottomColor: theme.inputBorderInvalid }),
    ...(isFocused && { borderBottomColor: theme.inputBorderFocused }),
    ...(isValid && { borderBottomColor: theme.inputBorderValid }),
    ...(disabled && styles.disabled),
    ...(!!hasButton && spacings.pr0),
    ...{
      color: theme.buttonText
    }
  }

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {!!label && (
        <Text fontSize={14} color={colors.martinique} weight="regular" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={[commonStyles.borderRadiusPrimary, commonStyles.hidden]}>
        <View style={styles.inputWrapper}>
          {!!leftIcon && <View style={styles.leftIcon}>{leftIcon()}</View>}
          {!!error && (
            <Text
              style={styles.errorText}
              weight={isWeb ? 'regular' : undefined}
              fontSize={12}
              appearance="danger"
            >
              {error}
            </Text>
          )}
          <input
            type={type}
            style={inputStyles}
            autoCapitalize="none"
            autoCorrect="false"
            editable={!disabled}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            onChange={onChangeText}
            {...rest}
          />
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

      {!!isValid && !!validLabel && !error && (
        <Text style={[styles.validText]} fontSize={12} color={colors.turquoise}>
          {validLabel}
        </Text>
      )}

      {!!info && (
        <Text style={[styles.infoText, infoTextStyle]} fontSize={12}>
          {info}
        </Text>
      )}
    </View>
  )
}

export default React.memo(Input)
