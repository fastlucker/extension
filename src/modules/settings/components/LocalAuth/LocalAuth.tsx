import React from 'react'
import { ActivityIndicator } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import spacings from '@modules/common/styles/spacings'
import { useNavigation } from '@react-navigation/native'

const LocalAuth = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { state, isLoading } = usePasscode()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

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
