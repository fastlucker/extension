import React from 'react'
import { TextProps } from 'react-native'

import Text from '../Text'
import styles from './styles'

interface Props extends TextProps {
  hasBottomSpacing?: boolean
  color?: string
}

const Title: React.FC<Props> = ({
  style = {},
  hasBottomSpacing = true,
  children,
  color
}: Props) => (
  <Text
    style={[styles.text, !!hasBottomSpacing && styles.bottomSpacing, !!color && { color }, style]}
  >
    {children}
  </Text>
)

export default Title
