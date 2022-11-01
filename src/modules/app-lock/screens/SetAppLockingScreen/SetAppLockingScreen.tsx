import React, { useEffect, useState } from 'react'

import { useTranslation } from '@config/localization'
import { PASSCODE_STATES } from '@modules/app-lock/contexts/appLockContext/constants'
import useAppLock from '@modules/app-lock/hooks/useAppLock'
import Button from '@modules/common/components/Button'
import CodeInput from '@modules/common/components/CodeInput'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { DEVICE_SECURITY_LEVEL } from '@modules/common/contexts/biometricsContext/constants'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import { useIsFocused, useNavigation } from '@react-navigation/native'

enum STEPS {
  NEW_PASSCODE = 'NEW_PASSCODE',
  CONFIRM_NEW_PASSCODE = 'CONFIRM_NEW_PASSCODE',
  CONFIRM_BIOMETRICS_UNLOCK = 'CONFIRM_BIOMETRICS_UNLOCK'
}

const SetAppLockingScreen: React.FC = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { addToast } = useToast()
  const { state, removeAppLock, setAppLockPin, setAppLockBiometrics } = useAppLock()
  const { isLocalAuthSupported, deviceSecurityLevel, deviceSupportedAuthTypesLabel } =
    useBiometrics()
  const [step, setStep] = useState<STEPS>(STEPS.NEW_PASSCODE)
  const [newPasscode, setNewPasscode] = useState('')
  const [passcodeConfirmFailed, setPasscodeConfirmFailed] = useState(false)
  const isFocused = useIsFocused()

  // On going back (loosing routing focus), reset state, otherwise there is
  // no way for the user to reset this flow (other than kill the app).
  // Also, resets the state upon initial successful passcode configuring.
  useEffect(() => {
    return () => {
      setNewPasscode('')
      setPasscodeConfirmFailed(false)
      setStep(STEPS.NEW_PASSCODE)
    }
  }, [isFocused])

  const handleOnFulfillStep1 = (code: string) => {
    setStep(STEPS.CONFIRM_NEW_PASSCODE)
    return setNewPasscode(code)
  }

  const handleOnFulfillStep2 = async (code: string) => {
    if (code !== newPasscode) {
      return setPasscodeConfirmFailed(true)
    }

    const added = await setAppLockPin(code)
    if (added) {
      addToast(t('App lock set!') as string, { timeout: 5000 })

      // Nor a face, nor a fingerprint scanner is available on the device.
      // Therefore - security level of `DEVICE_SECURITY_LEVEL.BIOMETRIC`
      // is not achievable on this device and biometrics unlock is not feasible.
      // Skip biometrics unlock prompt.
      if (!isLocalAuthSupported) {
        return navigation.navigate('dashboard')
      }

      setStep(STEPS.CONFIRM_BIOMETRICS_UNLOCK)
    }
  }

  const handleOnFulfillStep3 = async () => {
    const enabled = await setAppLockBiometrics()

    // Stay on this step.
    if (!enabled) return

    addToast(t('Biometrics unlock enabled!') as string, { timeout: 5000 })
    navigation.navigate('dashboard')
  }

  const handleSkipStep3 = () => navigation.navigate('dashboard')

  const handleOnRemoveAppLock = async () => {
    await removeAppLock()

    addToast(t('App lock removed!') as string, { timeout: 5000 })
    navigation.navigate('dashboard')
  }

  const renderBiometricUnlockContent = () => {
    // Determine what kind of authentication is enrolled on the device.
    if (deviceSecurityLevel !== DEVICE_SECURITY_LEVEL.BIOMETRIC) {
      return (
        <>
          <Text type="small" appearance="danger" style={spacings.mb}>
            {t(
              'This device supports biometric authentication, but you have not enrolled it on this device. If you want to use it - enroll it first on your device, then trigger the app locking process again.'
            )}
          </Text>
          <Button onPress={handleSkipStep3} text={t('All right')} />
        </>
      )
    }

    return (
      <>
        <Button onPress={handleOnFulfillStep3} text={t('Enable biometrics unlock')} />
        <Button type="ghost" onPress={handleSkipStep3} text={t('Skip')} />
      </>
    )
  }

  const renderContent = () => {
    if (state === PASSCODE_STATES.NO_PASSCODE) {
      return (
        <>
          <Title style={textStyles.center}>{t('Create PIN')}</Title>
          <Text type="small" style={spacings.mbSm}>
            {t('Set a PIN to protect your app.')}
          </Text>
        </>
      )
    }

    if (step === STEPS.CONFIRM_NEW_PASSCODE) {
      return (
        <>
          <Title style={textStyles.center}>{t('Confirm new PIN')}</Title>
          <Text type="small" style={spacings.mbSm}>
            {t('Please type the PIN again, to confirm it.')}
          </Text>
        </>
      )
    }

    if (step === STEPS.CONFIRM_BIOMETRICS_UNLOCK) {
      return (
        <>
          <Title style={textStyles.center}>{t('Set biometric unlock')}</Title>
          <Text type="small" style={spacings.mb}>
            {deviceSupportedAuthTypesLabel
              ? t(
                  'For quick access, use your {{deviceSupportedAuthTypesLabel}} to authenticate in the Ambire app.',
                  {
                    deviceSupportedAuthTypesLabel
                  }
                )
              : t(
                  'For quick access, use your phone biometric machanism to authenticate in the Ambire app.'
                )}
          </Text>
          {renderBiometricUnlockContent()}
        </>
      )
    }

    return (
      <>
        <Title style={textStyles.center}>{t('Change your app lock PIN')}</Title>
        <Text type="small" style={spacings.mbSm}>
          {t('Please enter a new PIN.')}
        </Text>
      </>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        {renderContent()}
        {passcodeConfirmFailed && (
          <Text type="small" appearance="danger" style={spacings.mbSm}>
            {t("PINs don't match!")}
          </Text>
        )}
        {step === STEPS.NEW_PASSCODE && <CodeInput autoFocus onFulfill={handleOnFulfillStep1} />}
        {step === STEPS.CONFIRM_NEW_PASSCODE && (
          <CodeInput autoFocus onFulfill={handleOnFulfillStep2} />
        )}
        {state !== PASSCODE_STATES.NO_PASSCODE && step === STEPS.NEW_PASSCODE && (
          <>
            <Text type="small" style={[textStyles.center, spacings.mtTy, spacings.mbLg]}>
              {t('– or –')}
            </Text>
            <Button type="secondary" text={t('Remove app lock')} onPress={handleOnRemoveAppLock} />
          </>
        )}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default SetAppLockingScreen
