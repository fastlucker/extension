import React from 'react'
import { TextProps, TextStyle } from 'react-native'

import Text from '../Text'
import styles from './styles'

type TitleTypes = 'regular' | 'small'

interface Props extends TextProps {
  type?: TitleTypes
  hasBottomSpacing?: boolean
  color?: string
}

const titleStyles: { [key in TitleTypes]: TextStyle } = {
  regular: styles.titleRegular,
  small: styles.titleSmall
}

const Title: React.FC<Props> = ({
  type = 'regular',
  style = {},
  hasBottomSpacing = true,
  children,
  color
}: Props) => (
  <Text
    style={[
      titleStyles[type],
      !!hasBottomSpacing && styles.bottomSpacing,
      !!color && { color },
      style
    ]}
  >
    {children}
  </Text>
)

export default Title
