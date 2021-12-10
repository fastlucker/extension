import React from 'react'
import { Text, View } from 'react-native'

import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import styles from './styles'

interface Props extends NativeStackScreenProps<any, 'auth'> {}

const AuthScreen = ({ navigation }: Props) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Button text={t('Add a new account')} onPress={() => navigation.navigate('addNewAccount')} />
      <Button text={t('Email login')} onPress={() => navigation.navigate('emailLogin')} />
      <Text>App env: {CONFIG.APP_ENV}</Text>
    </View>
  )
}

export default AuthScreen
