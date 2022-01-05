import React from 'react'
import { StyleSheet, Text as RNText, TextProps } from 'react-native'

import styles from './styles'

interface Props extends TextProps {
  underline?: boolean
}

const Text: React.FC<Props> = ({ children, underline, style = {}, ...rest }) => (
  <RNText
    style={StyleSheet.flatten([styles.text, style, !!underline && styles.underline])}
    {...rest}
  >
    {children}
  </RNText>
)

export default Text
