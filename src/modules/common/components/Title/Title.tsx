import React from 'react'
import { TextProps } from 'react-native'

import Text from '../Text'
import styles from './styles'

const Title: React.FC<TextProps> = ({ style = {}, children }) => (
  <Text style={[styles.text, style]}>{children}</Text>
)

export default Title
