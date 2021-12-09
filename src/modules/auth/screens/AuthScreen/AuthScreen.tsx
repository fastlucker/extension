import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

import { useAuth } from '@modules/auth/contexts/auth'
import Placeholder from '@modules/common/components/Placeholder'
import CONFIG from '@config/env'

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
      <Text>App env: {CONFIG.APP_ENV}</Text>
    </View>
  )
}

export default AuthScreen
