import React from 'react'
import { Button, StyleSheet, View } from 'react-native'

import { useAuth } from '@modules/auth/contexts/auth'
import Placeholder from '@modules/common/components/Placeholder'
import i18n from '@config/localization'

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
      <Placeholder text={i18n.t('Auth screen')} />
      <Button title="Login" onPress={logIn} />
    </View>
  )
}

export default AuthScreen
