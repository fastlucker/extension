import React from 'react'
import { TextInput, TextInputProps, View } from 'react-native'

import Text from '@modules/common/components/Text'

import styles from './styles'

interface Props extends TextInputProps {
  info?: string
}

const Input = ({ info, ...rest }: Props) => (
  <View style={styles.inputContainer}>
    <TextInput style={styles.input} autoCapitalize="none" autoCorrect={false} {...rest} />
    {!!info && <Text style={styles.info}>{info}</Text>}
  </View>
)

export default Input
