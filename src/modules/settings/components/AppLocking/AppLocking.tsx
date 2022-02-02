import React from 'react'
import { ActivityIndicator } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import spacings from '@modules/common/styles/spacings'
import { useNavigation } from '@react-navigation/native'

const AppLocking = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { isLoading } = useAccountsPasswords()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    <Button text={t('Manage app locking')} onPress={() => navigation.navigate('app-locking')} />
  )
}

export default AppLocking
