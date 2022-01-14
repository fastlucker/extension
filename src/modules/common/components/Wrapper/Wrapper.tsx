import React from 'react'
import { ScrollViewProps, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import styles from './styles'

const Wrapper: React.FC<ScrollViewProps> = ({
  style = {},
  contentContainerStyle = {},
  children
}) => (
  <ScrollView
    style={[styles.wrapper, style]}
    contentContainerStyle={StyleSheet.flatten([
      styles.contentContainerStyle,
      contentContainerStyle
    ])}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="none"
    alwaysBounceVertical={false}
  >
    {children}
  </ScrollView>
)

export default Wrapper
