import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Props {
  handleNavigate: (route: string) => void
}

const BiometricsSign: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const { isLoading, selectedAccHasPassword } = useAccountsPasswords()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    <TouchableOpacity onPress={() => handleNavigate('biometrics-sign-change')}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {selectedAccHasPassword ? t('Biometrics sign (enabled)') : t('Biometrics sign (disabled)')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(BiometricsSign)
