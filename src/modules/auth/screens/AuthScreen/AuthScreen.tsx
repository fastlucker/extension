import React from 'react'
import { StyleSheet, View } from 'react-native'

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
    </View>
  )
}

export default AuthScreen
