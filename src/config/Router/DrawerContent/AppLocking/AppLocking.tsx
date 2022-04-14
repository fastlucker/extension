import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import spacings from '@modules/common/styles/spacings'
import { useNavigation } from '@react-navigation/native'

const AppLocking = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { isLoading } = useAccountsPasswords()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    <TouchableOpacity onPress={() => navigation.navigate('app-locking')}>
      <Text style={spacings.mbSm}>{t('Manage app locking')}</Text>
    </TouchableOpacity>
  )
}

export default AppLocking
