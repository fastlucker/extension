import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useTranslation } from '@config/localization'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Props {
  handleNavigate: (route: string) => void
}

const ManageVaultLockButton: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const { isLoading: isLoadingBiometrics } = useBiometrics()

  if (isLoadingBiometrics)
    return (
      <View style={spacings.mv}>
        <Spinner />
      </View>
    )

  return (
    <TouchableOpacity onPress={() => handleNavigate('manage-vault-lock')} style={spacings.mbSm}>
      <Text color={colors.titan_50}>{t('Manage Key Store lock')}</Text>
    </TouchableOpacity>
  )
}

export default React.memo(ManageVaultLockButton)
