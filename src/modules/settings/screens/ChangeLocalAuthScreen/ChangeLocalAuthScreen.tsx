import React from 'react'
import { View } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import {
  DEVICE_SECURITY_LEVEL,
  PASSCODE_STATES
} from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { useNavigation } from '@react-navigation/native'

const ChangeLocalAuthScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const {
    isLocalAuthSupported,
    addLocalAuth,
    state,
    removeLocalAuth,
    deviceSecurityLevel,
    deviceSupportedAuthTypesLabel,
    fallbackSupportedAuthTypesLabel
  } = usePasscode()

  const handleEnable = async () => {
    const enabled = await addLocalAuth()

    if (enabled) {
      addToast(t('Local auth enabled!') as string, { timeout: 5000 })
      navigation.navigate('dashboard')
    }
  }

  const handleDisable = async () => {
    await removeLocalAuth()

    addToast(t('Local auth disabled!') as string, { timeout: 5000 })
    navigation.navigate('dashboard')
  }

  const renderContent = () => {
    if (!isLocalAuthSupported) {
      return (
        <Text type="small" appearance="danger" style={spacings.mb}>
          {t(
            'Nor a face, nor a fingerprint scanner is available on the device. Therefore, enabling local authentication is not possible.'
          )}
        </Text>
      )
    }

    if (deviceSecurityLevel === DEVICE_SECURITY_LEVEL.NONE) {
      return (
        <Text type="small" appearance="danger" style={spacings.mb}>
          {t(
            'No local authentication is enrolled on your device. Therefore, enabling local authentication is not possible.'
          )}
        </Text>
      )
    }

    if (state === PASSCODE_STATES.NO_PASSCODE) {
      return (
        <>
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mbLg]}>
            <InfoIcon color={colors.pink} width={24} height={24} style={spacings.mrTy} />
            <Text type="small" appearance="danger" style={flexboxStyles.flex1}>
              {t('In order to enable it, first you need to create a passcode.')}
            </Text>
          </View>
          <Button
            text={t('Create passcode')}
            onPress={() => navigation.navigate('passcode-change')}
          />
        </>
      )
    }

    return state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH ? (
      <Button onPress={handleDisable} text={t('Disable')} />
    ) : (
      <Button onPress={handleEnable} text={t('Enable')} />
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <>
          <Text type="small" style={spacings.mb}>
            {deviceSupportedAuthTypesLabel
              ? t(
                  'Enabling local authentication allows you to use your {{deviceSupportedAuthTypesLabel}} or your phone {{fallbackSupportedAuthTypesLabel}} to authenticate in the Ambire app.',
                  { deviceSupportedAuthTypesLabel, fallbackSupportedAuthTypesLabel }
                )
              : t(
                  'Enabling local authentication allows you to use your phone {{fallbackSupportedAuthTypesLabel}} to authenticate in the Ambire app.',
                  { fallbackSupportedAuthTypesLabel }
                )}
          </Text>
          {renderContent()}
        </>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ChangeLocalAuthScreen
