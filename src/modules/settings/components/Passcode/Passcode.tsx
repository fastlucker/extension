import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import spacings from '@modules/common/styles/spacings'
import { useIsFocused, useNavigation } from '@react-navigation/native'

const Passcode = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const isFocused = useIsFocused()
  const {
    state,
    isLoading,
    triggerPasscodeAuth,
    hasEnteredValidPasscode,
    resetValidPasscodeEntered
  } = usePasscode()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  useEffect(() => {
    if (hasEnteredValidPasscode && isFocused) {
      navigation.navigate('passcode-change')
      resetValidPasscodeEntered()
    }
  }, [hasEnteredValidPasscode, isFocused])

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
