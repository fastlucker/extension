import React from 'react'
import { Button, StyleSheet, View } from 'react-native'

import { useAuth } from '@modules/auth/contexts/auth'
import Placeholder from '@modules/common/components/Placeholder'
import { changeLanguage, useTranslation } from '@config/localization'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const AuthScreen = () => {
  const { t } = useTranslation()
  const { logIn } = useAuth()

  return (
    <View style={styles.container}>
      <Placeholder text={t('Auth screen')} />
      <Button title="Login" onPress={logIn} />
    </View>
  )
}

export default AuthScreen
