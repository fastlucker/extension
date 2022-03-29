import React from 'react'
import { StyleSheet, Text as RNText, TextProps, TextStyle } from 'react-native'

import styles from './styles'

type TextTypes = 'regular' | 'small' | 'caption' | 'info' | 'danger'

export interface Props extends TextProps {
  underline?: boolean
  type?: TextTypes
  fontSize?: number
  color?: string
}

// TODO: This one is deprecated. Reference directly the 'danger' text type.
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum TEXT_TYPES {
  DANGER = 'danger'
}

const textStyles: { [key in TextTypes]: TextStyle } = {
  regular: styles.textRegular,
  small: styles.textSmall,
  caption: styles.textCaption,
  info: styles.textCaption,
  danger: styles.textCaption
}

const Text: React.FC<Props> = ({
  type = 'regular',
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
      !!fontSize && {
        fontSize,
        // In case there is a custom `fontSize` passed, reset the `lineHeight`,
        // otherwise, one must also provide a different lineHeight than
        // the default one when using a custom `fontSize`.
        lineHeight: undefined
      },
      !!color && { color },
      style
    ])}
    {...rest}
  >
    {children}
  </RNText>
)

export default Text
