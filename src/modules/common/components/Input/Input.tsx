import React, { useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View
} from 'react-native'

import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'

import styles from './styles'

interface Props extends TextInputProps {
  info?: string
}

const Input = ({ info, onBlur = () => {}, onFocus = () => {}, ...rest }: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true)
    return onFocus(e)
  }
  const handleOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false)
    return onBlur(e)
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholderTextColor={colors.inputPlaceholderColor}
        style={[styles.input, isFocused && styles.focused]}
        autoCapitalize="none"
        autoCorrect={false}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        {...rest}
      />
      {!!info && <Text style={styles.info}>{info}</Text>}
    </View>
  )
}

export default Input
