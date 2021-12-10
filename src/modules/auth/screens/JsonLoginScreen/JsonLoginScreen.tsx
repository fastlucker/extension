import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import useJsonLogin from '@modules/auth/hooks/useJsonLogin'
import Button from '@modules/common/components/Button'

import styles from './styles'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin } = useJsonLogin()

  return (
    <View style={styles.container}>
      <Button text={t('Select file')} onPress={handleLogin} />
    </View>
  )
}

export default JsonLoginScreen
