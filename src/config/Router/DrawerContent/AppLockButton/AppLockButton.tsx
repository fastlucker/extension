import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useTranslation } from '@config/localization'
import { APP_LOCK_STATES } from '@modules/app-lock/contexts/appLockContext/constants'
import useAppLock from '@modules/app-lock/hooks/useAppLock'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Props {
  handleNavigate: (route: string) => void
}

const AppLockButton: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const { lockState, isLoading } = useAppLock()

  if (isLoading)
    return (
      <View style={spacings.mv}>
        <Spinner />
      </View>
    )

  if (lockState !== APP_LOCK_STATES.UNLOCKED) {
    return null
  }

  return (
    <TouchableOpacity onPress={() => handleNavigate('set-app-lock')}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {t('Set app lock')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(AppLockButton)
