import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import useJsonLogin from '@modules/auth/hooks/useJsonLogin'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'

import styles from './styles'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error } = useJsonLogin()

  return (
    <View style={styles.container}>
      {<P>{error}</P>}
      <Button text={t('Select file')} onPress={handleLogin} />
    </View>
  )
}

export default JsonLoginScreen
