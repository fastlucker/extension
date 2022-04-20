import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import spacings from '@modules/common/styles/spacings'
import { useNavigation } from '@react-navigation/native'

const LocalAuth = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { state, isLoading } = usePasscode()

  if (isLoading) return <ActivityIndicator style={spacings.mv} />

  return (
    <TouchableOpacity onPress={() => navigation.navigate('local-auth-change')}>
      <Text style={spacings.mbSm}>
        {state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
          ? t('Local auth (enabled)')
          : t('Local auth (disabled)')}
      </Text>
    </TouchableOpacity>
  )
}

export default LocalAuth
