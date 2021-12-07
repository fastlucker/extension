import React from 'react'
import { Button, StyleSheet, View } from 'react-native'

import Placeholder from '@components/Placeholder'
import { useAuth } from '@contexts/auth'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const AuthScreen = () => {
  const { logIn } = useAuth()
  return (
    <View style={styles.container}>
      <Placeholder text="Auth screen" />
      <Button title="Login" onPress={logIn} />
    </View>
  )
}

export default AuthScreen
