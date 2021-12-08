import React from 'react'
import { StyleSheet, View } from 'react-native'

import EmailLogin from '@modules/auth/components/EmailLogin'
import { useAuth } from '@modules/auth/contexts/auth'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
})

const AuthScreen = () => {
  const { logIn } = useAuth()
  const handleLogin = () => {
    logIn()
  }

  return (
    <View style={styles.container}>
      <EmailLogin onSubmit={handleLogin} />
    </View>
  )
}

export default AuthScreen
