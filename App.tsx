import { StatusBar } from 'expo-status-bar'
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

const App = function () {
  return (
    <View style={styles.container}>
      <Placeholder text="Ambire app initial screen" />

      <StatusBar style="auto" />
    </View>
  )
}

export default App
