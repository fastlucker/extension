import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Props {
  handleNavigate: (route: string) => void
}

const ManageAppLockButton: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()

  return (
    <TouchableOpacity onPress={() => handleNavigate('manage-app-locking')}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {t('Manage app lock')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(ManageAppLockButton)
