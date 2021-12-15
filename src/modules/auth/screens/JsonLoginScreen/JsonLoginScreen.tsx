import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import useJsonLogin from '@modules/auth/hooks/useJsonLogin'
import Button from '@modules/common/components/Button'
import Heading from '@modules/common/components/Heading'
import P from '@modules/common/components/P'

import styles from './styles'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress } = useJsonLogin()

  return (
    <View style={styles.container}>
      <Heading>{t('Import from JSON')}</Heading>
      <Button
        disabled={inProgress}
        text={inProgress ? t('Importing...') : t('Select file')}
        onPress={handleLogin}
      />
      {!!error && <P>{error}</P>}
    </View>
  )
}

export default JsonLoginScreen
