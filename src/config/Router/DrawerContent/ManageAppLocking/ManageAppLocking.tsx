import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import useBiometricsSign from '@modules/biometrics-sign/hooks/useBiometricsSign'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Props {
  handleNavigate: (route: string) => void
}

const ManageAppLocking: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const { isLoading } = useBiometricsSign()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    <TouchableOpacity onPress={() => handleNavigate('manage-app-locking')}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {t('Manage app locking')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(ManageAppLocking)
