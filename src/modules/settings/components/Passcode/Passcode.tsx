import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext'
import usePasscode from '@modules/common/hooks/usePasscode'
import { useNavigation } from '@react-navigation/native'

const Passcode = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { state, isLoading } = usePasscode()

  if (isLoading) return null

  return state === PASSCODE_STATES.NO_PASSCODE ? (
    <Button text={t('Create passcode')} onPress={() => navigation.navigate('passcode-change')} />
  ) : (
    <Button text={t('Change passcode')} onPress={() => navigation.navigate('passcode-validate')} />
  )
}

export default Passcode
