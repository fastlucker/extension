import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import { SECURE_STORE_KEY } from '@modules/settings/constants'
import { useNavigation } from '@react-navigation/native'

const LocalAuth = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [passcode, setPasscode] = useState<null | string>(null)

  // Check if hardware supports biometrics
  useEffect(() => {
    ;(async () => {
      const secureStoreItem = await SecureStore.getItemAsync(SECURE_STORE_KEY)
      if (secureStoreItem) {
        setPasscode(secureStoreItem)
      }
    })()
  }, [])

  return passcode ? (
    <Button text={t('Change passcode')} onPress={() => navigation.navigate('passcode-change')} />
  ) : (
    <Button text={t('Create passcode')} onPress={() => navigation.navigate('passcode-create')} />
  )
}

export default LocalAuth
