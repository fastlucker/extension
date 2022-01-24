import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import usePasscode from '@modules/common/hooks/usePasscode'
import { useNavigation } from '@react-navigation/native'

const LocalAuth = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { hasLocalAuth, isLoadingLocalAuth } = usePasscode()

  if (isLoadingLocalAuth) return null

  return hasLocalAuth ? (
    <Button
      text={t('Change local auth')}
      onPress={() => navigation.navigate('local-auth-create')}
    />
  ) : (
    <Button text={t('Add local auth')} onPress={() => navigation.navigate('local-auth-create')} />
  )
}

export default LocalAuth
