import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import spacings from '@modules/common/styles/spacings'
import { useNavigation } from '@react-navigation/native'

const Passcode = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { state, isLoading, triggerPasscodeAuth, isAuthenticated } = usePasscode()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('passcode-change')
    }
  }, [isAuthenticated])

  return state === PASSCODE_STATES.NO_PASSCODE ? (
    <Button
      text={t('App passcode (not added ❌)')}
      onPress={() => navigation.navigate('passcode-change')}
    />
  ) : (
    <Button text={t('App passcode (added ✅)')} onPress={triggerPasscodeAuth} />
  )
}

export default Passcode
