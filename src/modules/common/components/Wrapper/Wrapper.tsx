import React from 'react'
import { TextProps, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import styles from './styles'

const Wrapper: React.FC<TextProps> = ({ style = {}, children }) => (
  <ScrollView style={[styles.wrapper, style]} contentContainerStyle={styles.contentContainerStyle}>
    {children}
  </ScrollView>
)

export default Wrapper
