import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext'
import usePasscode from '@modules/common/hooks/usePasscode'
import { useNavigation } from '@react-navigation/native'

const LocalAuth = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { state, isLoading } = usePasscode()

  if (isLoading) return null

  return (
    <Button
      text={
        state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
          ? t('Local auth (enabled ✅)')
          : t('Local auth (not enabled ❌)')
      }
      onPress={() => navigation.navigate('local-auth-change')}
    />
  )
}

export default LocalAuth
