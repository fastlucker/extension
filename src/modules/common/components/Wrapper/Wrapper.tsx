import React from 'react'
import { ScrollViewProps } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import styles from './styles'

const Wrapper: React.FC<ScrollViewProps> = ({
  style = {},
  contentContainerStyle = {},
  children
}) => (
  <ScrollView
    style={[styles.wrapper, style]}
    contentContainerStyle={[styles.contentContainerStyle, contentContainerStyle]}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="none"
    alwaysBounceVertical={false}
  >
    {children}
  </ScrollView>
)

export default Wrapper
