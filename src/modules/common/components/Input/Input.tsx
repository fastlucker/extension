import React, { useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native'

import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

export interface InputProps extends TextInputProps {
  info?: string
  label?: string
  buttonText?: string | JSX.Element
  onButtonPress?: () => void
  disabled?: boolean
}

const Input = ({
  label,
  buttonText,
  info,
  onBlur = () => {},
  onFocus = () => {},
  onButtonPress = () => {},
  disabled,
  ...rest
}: InputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true)
    return onFocus(e)
  }
  const handleOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false)
    return onBlur(e)
  }

  const hasButton = !!buttonText

  return (
    <View style={[styles.inputContainer, disabled && styles.disabled]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={flexboxStyles.directionRow}>
        <TextInput
          placeholderTextColor={colors.inputPlaceholderColor}
          style={[styles.input, isFocused && styles.focused, hasButton && spacings.pr0]}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          {...rest}
        />
        {hasButton && (
          <TouchableOpacity
            onPress={onButtonPress}
            disabled={disabled}
            style={[styles.button, isFocused && styles.focused]}
          >
            <Text style={textStyles.bold}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!info && <Text style={styles.info}>{info}</Text>}
    </View>
  )
}

export default Input
