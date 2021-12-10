import React from 'react'
import { Text, View } from 'react-native'

import CONFIG from '@config/env'
import Button from '@modules/common/components/Button'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import styles from './styles'

interface Props extends NativeStackScreenProps<any, 'auth'> {}

const AuthScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Button text="Email login" onPress={() => navigation.navigate('emailLogin')} />
      <Text>App env: {CONFIG.APP_ENV}</Text>
    </View>
  )
}

export default AuthScreen
