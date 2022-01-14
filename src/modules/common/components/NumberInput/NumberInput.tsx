import React from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'

import Text from '@modules/common/components/Text'

import styles from './styles'

interface Props extends TextInputProps {
  buttonText?: string
  onButtonPress?: () => any
  precision?: any
}

const NumberInput = ({ buttonText, onButtonPress, onChangeText, precision, ...rest }: Props) => {
  const onInputValue = (value: string) => {
    if (!onChangeText) return
    if (!value) return onChangeText('')

    const afterDecimals = value?.split('.')[1]
    if (afterDecimals && afterDecimals.length > precision) return

    const isIntOrFloat = /^[0-9]+\.{0,1}[0-9]*$/g.test(value)
    isIntOrFloat && onChangeText(value)
  }
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
        onChangeText={onInputValue}
      />
      {!!buttonText && (
        <TouchableOpacity onPress={onButtonPress} style={styles.button}>
          <Text>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default NumberInput
