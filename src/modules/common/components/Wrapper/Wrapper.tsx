import React from 'react'
import { TextProps, View } from 'react-native'

import styles from './styles'

const Wrapper: React.FC<TextProps> = ({ style = {}, children }) => (
  <View style={[styles.wrapper, style]}>{children}</View>
)

export default Wrapper
