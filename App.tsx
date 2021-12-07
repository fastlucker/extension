import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import Placeholder from '@components/Placeholder'
import { NavigationContainer } from '@react-navigation/native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const App = () => (
  <NavigationContainer>
    <View style={styles.container}>
      <Placeholder text="Ambire app screen" />
      <StatusBar style="auto" />
    </View>
  </NavigationContainer>
)

export default App
