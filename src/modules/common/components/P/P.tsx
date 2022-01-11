import React from 'react'

import Text, { Props as TextProps } from '@modules/common/components/Text'

import styles from './styles'

interface Props extends TextProps {}

const P = ({ children, ...rest }: Props) => (
  <Text style={styles.text} {...rest}>
    {children}
  </Text>
)

export default P
