import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import { PASSCODE_STATES } from '@modules/app-lock/contexts/appLockContext/constants'
import useAppLock from '@modules/app-lock/hooks/useAppLock'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Props {
  handleNavigate: (route: string) => void
}

const AppLock: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const { state, isLoading } = useAppLock()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    state === PASSCODE_STATES.NO_PASSCODE && (
      <TouchableOpacity onPress={() => handleNavigate('set-app-lock')}>
        <Text style={spacings.mbSm} color={colors.titan_50}>
          {t('Set app lock')}
        </Text>
      </TouchableOpacity>
    )
  )
}

export default React.memo(AppLock)
