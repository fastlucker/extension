import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import useJsonLogin from '@modules/auth/hooks/useJsonLogin'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'

import styles from './styles'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress } = useJsonLogin()

  return (
    <View style={styles.container}>
      {!!error && <P>{error}</P>}
      <Button
        disabled={inProgress}
        text={inProgress ? t('Importing...') : t('Select file')}
        onPress={handleLogin}
      />
    </View>
  )
}

export default JsonLoginScreen
