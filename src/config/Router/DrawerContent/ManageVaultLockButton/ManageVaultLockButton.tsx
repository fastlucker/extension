import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useBiometrics from '@common/hooks/useBiometrics'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { useTranslation } from '@config/localization'
import { ROUTES } from '@config/Router/routesConfig'

interface Props {
  handleNavigate: (route: ROUTES) => void
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
    <TouchableOpacity onPress={() => handleNavigate(ROUTES.manageVaultLock)} style={spacings.mbSm}>
      <Text color={colors.titan_50}>{t('Manage Key Store lock')}</Text>
    </TouchableOpacity>
  )
}

export default React.memo(ManageVaultLockButton)
