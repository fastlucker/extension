import React, { useEffect } from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import { APP_LOCK_STATES } from '@modules/app-lock/contexts/appLockContext/constants'
import useAppLock from '@modules/app-lock/hooks/useAppLock'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import { useIsFocused } from '@react-navigation/native'

interface Props {
  handleNavigate: (route: string) => void
}

const ManageAppLockButton: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const {
    isLoading,
    lockState,
    triggerEnteringPasscode,
    hasEnteredValidPasscode,
    resetValidPasscodeEntered
  } = useAppLock()

  useEffect(() => {
    if (hasEnteredValidPasscode && isFocused) {
      handleNavigate('manage-app-locking')
      resetValidPasscodeEntered()
    }
  }, [handleNavigate, resetValidPasscodeEntered, hasEnteredValidPasscode, isFocused])

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  if (lockState === APP_LOCK_STATES.UNLOCKED) {
    return null
  }

  return (
    <TouchableOpacity onPress={triggerEnteringPasscode}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {t('Manage app lock')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(ManageAppLockButton)
