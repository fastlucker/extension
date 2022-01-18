import React from 'react'
import { StyleSheet, Text as RNText, TextProps } from 'react-native'

import styles from './styles'

export interface Props extends TextProps {
  underline?: boolean
  type?: TEXT_TYPES
  fontSize?: number
  color?: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
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
  fontSize,
  color,
  style = {},
  ...rest
}) => (
  <RNText
    style={StyleSheet.flatten([
      styles.text,
      textStyles[type],
      !!underline && styles.underline,
      !!fontSize && { fontSize },
      !!color && { color },
      style
    ])}
    {...rest}
  >
    {children}
  </RNText>
)

export default Text
