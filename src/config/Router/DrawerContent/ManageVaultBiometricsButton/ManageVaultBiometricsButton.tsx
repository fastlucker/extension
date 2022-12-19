import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useTranslation } from '@config/localization'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import useVaultBiometrics from '@modules/vault/hooks/useVaultBiometrics'

interface Props {
  handleNavigate: (route: string) => void
}

const ManageVaultBiometricsButton: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const { isLoading: isLoadingBiometrics, hasBiometricsHardware } = useBiometrics()
  const { biometricsEnabled } = useVaultBiometrics()

  if (isLoadingBiometrics)
    return (
      <View style={spacings.mv}>
        <Spinner />
      </View>
    )

  if (!hasBiometricsHardware) {
    return null
  }

  return (
    <TouchableOpacity onPress={() => handleNavigate('manage-vault-biometrics')}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {biometricsEnabled ? t('Manage biometrics unlock') : t('Set biometrics unlock')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(ManageVaultBiometricsButton)
