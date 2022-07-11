import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Props {
  handleNavigate: (route: string) => void
}

const LocalAuth: React.FC<Props> = ({ handleNavigate }) => {
  const { t } = useTranslation()
  const { state, isLoading } = usePasscode()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    <TouchableOpacity onPress={() => handleNavigate('local-auth-change')}>
      <Text style={spacings.mbSm} color={colors.titan_50}>
        {state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
          ? t('Local auth (enabled)')
          : t('Local auth (disabled)')}
      </Text>
    </TouchableOpacity>
  )
}

export default React.memo(LocalAuth)
