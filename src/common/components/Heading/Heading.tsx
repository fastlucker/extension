import React from 'react'
import { TextProps } from 'react-native'

import Text from '@common/components/Text'

import styles from './styles'

interface Props extends TextProps {}

const Heading = ({ children, ...rest }: Props) => (
  <Text style={styles.text} {...rest}>
    {children}
  </Text>
)

export default Heading
