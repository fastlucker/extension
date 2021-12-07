import React from 'react'
import { StyleSheet, View } from 'react-native'

import Placeholder from '@components/Placeholder'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const SettingsScreen = () => (
  <View style={styles.container}>
    <Placeholder text="Settings screen" />
  </View>
)

export default SettingsScreen
