import React from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'

import Text from '@modules/common/components/Text'

import styles from './styles'

interface Props extends TextInputProps {
  buttonText?: string
  onButtonPress?: () => any
}

const NumberInput = ({ buttonText, onButtonPress, ...rest }: Props) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      autoCapitalize="none"
      autoCorrect={false}
      {...rest}
    />
    {!!buttonText && (
      <TouchableOpacity onPress={onButtonPress} style={styles.button}>
        <Text>{buttonText}</Text>
      </TouchableOpacity>
    )}
  </View>
)

export default NumberInput
