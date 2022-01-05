import React from 'react'
import { StyleSheet, Text as RNText, TextProps } from 'react-native'

import styles from './styles'

interface Props extends TextProps {
  underline?: boolean
}

const Text = ({ children, underline, ...rest }: Props) => (
  <RNText style={StyleSheet.flatten([styles.text, !!underline && styles.underline])} {...rest}>
    {children}
  </RNText>
)

export default Text
