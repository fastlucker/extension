import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

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
      <Text>Ambire app initial screen</Text>
      <StatusBar style="auto" />
    </View>
  )
}

export default App
