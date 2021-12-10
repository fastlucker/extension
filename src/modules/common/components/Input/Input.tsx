import React from 'react'
import { TextInput, TextInputProps } from 'react-native'

import styles from './styles'

interface Props extends TextInputProps {}

const Input = ({ ...rest }: Props) => <TextInput style={styles.input} {...rest} />

export default Input
