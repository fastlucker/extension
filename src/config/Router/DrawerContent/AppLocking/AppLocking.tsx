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

const AppLocking: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const { isLoading } = useAccountsPasswords()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    <TouchableOpacity onPress={() => handleNavigate('app-locking')}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {t('Manage app locking')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(AppLocking)
