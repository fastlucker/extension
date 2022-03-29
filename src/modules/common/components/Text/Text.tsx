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
  SMALL = 'small',
  CAPTION = 'caption',
  INFO = 'info',
  DANGER = 'danger'
}

const textStyles = {
  [TEXT_TYPES.REGULAR]: styles.textRegular,
  [TEXT_TYPES.SMALL]: styles.textSmall,
  [TEXT_TYPES.CAPTION]: styles.textCaption,
  [TEXT_TYPES.INFO]: styles.textCaption,
  // TODO: Revise this one:
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
