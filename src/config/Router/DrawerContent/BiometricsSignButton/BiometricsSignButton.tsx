import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useTranslation } from '@config/localization'
import useBiometricsSign from '@modules/biometrics-sign/hooks/useBiometricsSign'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Props {
  handleNavigate: (route: string) => void
}

const BiometricsSignButton: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const { isLoading: isLoadingBiometrics, hasBiometricsHardware } = useBiometrics()
  const { biometricsEnabled } = useBiometricsSign()

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
    <TouchableOpacity onPress={() => handleNavigate('biometrics-sign-change')}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {biometricsEnabled ? t('Manage biometrics sign') : t('Set biometrics sign')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(BiometricsSignButton)
