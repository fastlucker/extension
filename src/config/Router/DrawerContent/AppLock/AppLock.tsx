import React, { useEffect } from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import { useIsFocused } from '@react-navigation/native'

interface Props {
  handleNavigate: (route: string) => void
}

const AppLock: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
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
      handleNavigate('passcode-change')
      resetValidPasscodeEntered()
    }
  }, [hasEnteredValidPasscode, isFocused])

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return state === PASSCODE_STATES.NO_PASSCODE ? (
    <TouchableOpacity onPress={() => handleNavigate('passcode-change')}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {t('Set app lock')}
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={triggerEnteringPasscode}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {t('Change app lock')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(AppLock)
