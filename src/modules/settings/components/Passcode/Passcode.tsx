import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import usePasscode from '@modules/common/hooks/usePasscode'
import { useNavigation } from '@react-navigation/native'

const Passcode = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { hasPasscode, isLoading } = usePasscode()

  if (isLoading) return null

  return hasPasscode ? (
    <Button text={t('Change passcode')} onPress={() => navigation.navigate('passcode-change')} />
  ) : (
    <Button text={t('Create passcode')} onPress={() => navigation.navigate('passcode-create')} />
  )
}

export default Passcode
