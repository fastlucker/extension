import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import spacings from '@modules/common/styles/spacings'
import { useNavigation } from '@react-navigation/native'

const BiometricsSign = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { isLoading, selectedAccHasPassword } = useAccountsPasswords()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    <TouchableOpacity onPress={() => navigation.navigate('biometrics-sign-change')}>
      <Text style={spacings.mbSm}>
        {selectedAccHasPassword
          ? t('Biometrics sign (enabled)')
          : t('Biometrics sign (not enabled)')}
      </Text>
    </TouchableOpacity>
  )
}

export default BiometricsSign
