import * as LocalAuthentication from 'expo-local-authentication'
import React, { useState } from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'

const LocalAuth = () => {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const [isEnabled, setIsEnabled] = useState(false)

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
      <P>{t('Use your fingerprint for quick access.')}</P>
      <Button onPress={handleOnActivate} text={t('Enable')} />
      <Text>{isEnabled ? 'Enabled!' : 'Not enabled yet!'}</Text>
    </>
  )
}

export default LocalAuth
