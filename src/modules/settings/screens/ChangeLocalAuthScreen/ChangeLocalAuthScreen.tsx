import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import { useNavigation } from '@react-navigation/native'

const ChangeLocalAuthScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const { isLocalAuthSupported, addLocalAuth, state, removeLocalAuth } = usePasscode()

  const handleEnable = async () => {
    await addLocalAuth()

    addToast(t('Local auth enabled!') as string, { timeout: 2000 })
    navigation.navigate('settings')
  }

  const handleDisable = async () => {
    await removeLocalAuth()

    addToast(t('Local auth disabled!') as string, { timeout: 2000 })
    navigation.navigate('settings')
  }

  const renderContent = () => {
    if (isLocalAuthSupported) {
      return (
        <>
          <P>
            {t(
              'Enabling local authentication allows you to use FaceID and TouchID (iOS) or the Biometric Prompt (Android) to authenticate the user with a face or fingerprint scan.'
            )}
          </P>
          <P type={TEXT_TYPES.DANGER}>
            {t(
              'Nor a face, nor a fingerprint scanner is available on the device. Therefore, enabling local authentication is not possible.'
            )}
          </P>
        </>
      )
    }

    return (
      <>
        <P>
          {t(
            'Enabling local authentication allows you to use FaceID and TouchID (iOS) or the Biometric Prompt (Android) to authenticate the user with a face or fingerprint scan.'
          )}
        </P>
        {state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH ? (
          <Button onPress={handleDisable} text={t('Disable')} />
        ) : (
          <Button onPress={handleEnable} text={t('Enable')} />
        )}
      </>
    )
  }

  return <Wrapper>{renderContent()}</Wrapper>
}

export default ChangeLocalAuthScreen
