import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import { useNavigation } from '@react-navigation/native'

const ChangeAppLockingScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    state,
    lockOnStartup,
    lockWhenInactive,
    enableLockOnStartup,
    disableLockOnStartup,
    enableLockWhenInactive,
    disableLockWhenInactive
  } = usePasscode()

  const renderContent = () => {
    if (state === PASSCODE_STATES.NO_PASSCODE) {
      return (
        <>
          <Text appearance="danger" style={spacings.mbSm}>
            {t('In order to enable it, first you need to create a passcode.')}
          </Text>
          <Button
            text={t('Create passcode')}
            onPress={() => navigation.navigate('passcode-change')}
          />
        </>
      )
    }

    return (
      <>
        {lockOnStartup ? (
          <Button onPress={disableLockOnStartup} text={t('Lock on startup (enabled ✅)')} />
        ) : (
          <Button onPress={enableLockOnStartup} text={t('Lock on startup (not enabled ❌)')} />
        )}

        {lockWhenInactive ? (
          <Button onPress={disableLockWhenInactive} text={t('Lock when inactive (enabled ✅)')} />
        ) : (
          <Button
            onPress={enableLockWhenInactive}
            text={t('Lock when inactive (not enabled ❌)')}
          />
        )}
      </>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper>{renderContent()}</Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ChangeAppLockingScreen
