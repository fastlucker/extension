import React from 'react'
import { StyleSheet, Text as RNText, TextProps } from 'react-native'

import styles from './styles'

interface Props extends TextProps {
  underline?: boolean
  type?: TEXT_TYPES
}

export enum TEXT_TYPES {
  REGULAR = 'regular',
  DANGER = 'danger'
}

const textStyles = {
  [TEXT_TYPES.REGULAR]: styles.textRegular,
  [TEXT_TYPES.DANGER]: styles.textDanger
}

const Text: React.FC<Props> = ({
  type = TEXT_TYPES.REGULAR,
  children,
  underline,
  style = {},
  ...rest
}) => (
  <RNText
    style={StyleSheet.flatten([
      styles.text,
      textStyles[type],
      !!underline && styles.underline,
      style
    ])}
    {...rest}
  >
    {children}
  </RNText>
)

export default Text
