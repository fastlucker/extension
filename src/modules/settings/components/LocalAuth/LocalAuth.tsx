import * as LocalAuthentication from 'expo-local-authentication'
import React, { useEffect, useState } from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'

const LocalAuth = () => {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const [isBiometricSupported, setIsBiometricSupported] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  // Check if hardware supports biometrics
  useEffect(() => {
    ;(async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      setIsBiometricSupported(compatible)
    })()
  })

  const handleOnActivate = async () => {
    const { success } = await LocalAuthentication.authenticateAsync()

    // TODO: Figure out this part
    const password = ''
    // const wallet = await Wallet.fromEncryptedJson(JSON.parse(account.primaryKeyBackup), password)

    setIsEnabled(success)
  }

  return (
    <>
      <Title>{t('Local authentication')}</Title>
      <P>
        {isBiometricSupported
          ? t('Your device is compatible with Biometrics')
          : t('Face or Fingerprint scanner is available on this device')}
      </P>
      <Button onPress={handleOnActivate} text={t('Enable')} />
      <Text>{isEnabled ? 'Enabled!' : 'Not enabled yet!'}</Text>
    </>
  )
}

export default LocalAuth
