import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import CONFIG from '@config/env'
import EmailLogin from '@modules/auth/components/EmailLogin'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
})

const AuthScreen = () => {
  return (
    <View style={styles.container}>
      <EmailLogin />
      <Text>App env: {CONFIG.APP_ENV}</Text>
    </View>
  )
}

export default AuthScreen
