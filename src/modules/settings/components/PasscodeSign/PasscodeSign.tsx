import React from 'react'
import { ActivityIndicator } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import spacings from '@modules/common/styles/spacings'
import { useNavigation } from '@react-navigation/native'

const PasscodeSign = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { isLoading, selectedAccHasPassword } = useAccountsPasswords()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    <Button
      text={
        selectedAccHasPassword
          ? t('Passcode sign (enabled ✅)')
          : t('Passcode sign (not enabled ❌)')
      }
      onPress={() => navigation.navigate('transactions-signing')}
    />
  )
}

export default PasscodeSign
