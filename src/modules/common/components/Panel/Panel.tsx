import React from 'react'
import { View, ViewProps } from 'react-native'

import styles from './styles'

const Panel: React.FC<ViewProps> = ({ children, style, ...rest }) => (
  <View style={[styles.container, style]} {...rest}>
    {children}
  </View>
)

export default Panel
