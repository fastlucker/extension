import React, { useEffect } from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
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
    triggerEnteringPasscode,
    hasEnteredValidPasscode,
    resetValidPasscodeEntered
  } = usePasscode()

  useEffect(() => {
    if (hasEnteredValidPasscode && isFocused) {
      navigation.navigate('passcode-change')
      resetValidPasscodeEntered()
    }
  }, [hasEnteredValidPasscode, isFocused])

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return state === PASSCODE_STATES.NO_PASSCODE ? (
    <TouchableOpacity onPress={() => navigation.navigate('passcode-change')}>
      <Text style={spacings.mbSm}>{t('App Passcode (not added)')}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={triggerEnteringPasscode}>
      <Text style={spacings.mbSm}>{t('App Passcode (added)')}</Text>
    </TouchableOpacity>
  )
}

export default Passcode
