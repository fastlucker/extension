import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import { useNavigation } from '@react-navigation/native'

const ChangeAppLockingScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const { state } = usePasscode()

  const toggleLockAppOnStartup = async () => {
    // TODO.
  }

  const toggleLockAppWhenInactive = async () => {
    // TODO.
  }

  const renderContent = () => {
    if (state === PASSCODE_STATES.NO_PASSCODE) {
      return (
        <>
          <P type={TEXT_TYPES.DANGER}>
            {t('In order to enable it, first you need to create a passcode.')}
          </P>
          <Button
            text={t('Create passcode')}
            onPress={() => navigation.navigate('passcode-change')}
          />
        </>
      )
    }

    return (
      <>
        <Button
          onPress={toggleLockAppOnStartup}
          text={true ? t('Lock on startup (enabled ✅)') : t('Lock on startup (not enabled ❌)')}
        />
        <Button
          onPress={toggleLockAppWhenInactive}
          text={
            true ? t('Lock when inactive (enabled ✅)') : t('Lock when inactive (not enabled ❌)')
          }
        />
      </>
    )
  }

  return <Wrapper>{renderContent()}</Wrapper>
}

export default ChangeAppLockingScreen
