import React from 'react'
import { TextProps } from 'react-native'

import Text from '../Text'
import styles from './styles'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum TITLE_TYPES {
  REGULAR = 'regular',
  SMALL = 'small'
}

interface Props extends TextProps {
  type: TITLE_TYPES
  hasBottomSpacing?: boolean
  color?: string
}

const titleStyles = {
  [TITLE_TYPES.REGULAR]: styles.titleRegular,
  [TITLE_TYPES.SMALL]: styles.titleSmall
}

const Title: React.FC<Props> = ({
  type = TITLE_TYPES.REGULAR,
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
