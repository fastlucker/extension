import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { useTranslation } from '@config/localization'
import useBiometricsSign from '@modules/biometrics-sign/hooks/useBiometricsSign'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import Wrapper from '@modules/common/components/Wrapper'
import { DEVICE_SECURITY_LEVEL } from '@modules/common/contexts/biometricsContext/constants'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import useVault from '@modules/vault/hooks/useVault'
import { useIsFocused, useNavigation } from '@react-navigation/native'

interface FormValues {
  password: string
}

const BiometricsSignScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const isFocused = useIsFocused()
  const { hasBiometricsHardware, deviceSecurityLevel } = useBiometrics()
  const {
    addKeystorePasswordToDeviceSecureStore,
    biometricsEnabled,
    removeKeystorePasswordFromDeviceSecureStore
  } = useBiometricsSign()
  const { isValidPassword } = useVault()
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      password: ''
    }
  })

  // On going back (loosing routing focus), reset state, otherwise there is
  // no way for the user to reset this form (other than kill the app).
  // Also, resets the state upon initial successful passcode configuring.
  useEffect(() => {
    return () => reset()
  }, [reset, isFocused])

  const handleEnable = async ({ password }: FormValues) => {
    // Dismiss the keyboard, because the validation process sometimes takes longer,
    // and having the keyboard in there all the time, is strange.
    Keyboard.dismiss()

    const isValidVaultPassword = await isValidPassword({ password })
    if (!isValidVaultPassword) {
      return setError(
        'password',
        { type: 'focus', message: t('Wrong Ambire Keystore password.') },
        { shouldFocus: true }
      )
    }

    const enable = await addKeystorePasswordToDeviceSecureStore(password)
    if (enable) {
      addToast(t('Unlock with biometrics enabled!') as string, { timeout: 3000 })
      navigation.navigate('dashboard')
    }
    return enable
  }

  const handleDisable = async () => {
    const disabled = await removeKeystorePasswordFromDeviceSecureStore()
    if (disabled) {
      addToast(t('Unlock with biometrics disabled!') as string, { timeout: 3000 })
      navigation.navigate('dashboard')
    }
  }

  const renderContent = () => {
    if (biometricsEnabled) {
      return (
        <>
          <Text type="small" weight="medium" style={spacings.mb}>
            {t('Enabled!')}
          </Text>
          <Button text={t('Disable')} onPress={handleDisable} />
        </>
      )
    }

    if (!hasBiometricsHardware) {
      return (
        <TextWarning appearance="info">
          {t('Biometrics authentication is not available on your device.')}
        </TextWarning>
      )
    }

    if (deviceSecurityLevel !== DEVICE_SECURITY_LEVEL.BIOMETRIC) {
      return (
        <Text type="small" appearance="danger" style={spacings.mb}>
          {t(
            'This device supports biometric authentication, but you have not enrolled it on this device. If you want to use it - enroll it first on your device.'
          )}
        </Text>
      )
    }

    return (
      <>
        <Text type="small" style={spacings.mb}>
          {t('To enable it, enter your Ambire Keystore password.')}
        </Text>
        <Controller
          control={control}
          rules={{ required: t('Please fill in a password.') as string }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPassword
              placeholder={t('Ambire Keystore password')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              disabled={isSubmitting}
              error={!!errors.password && errors.password.message}
            />
          )}
          name="password"
        />
        <Button
          disabled={isSubmitting}
          text={isSubmitting ? t('Validating...') : t('Enable')}
          onPress={handleSubmit(handleEnable)}
        />
      </>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Text type="small" style={spacings.mbLg}>
          {t('You can opt-in to use your phone biometrics to unlock your Ambire Keystore.')}
        </Text>
        {renderContent()}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default BiometricsSignScreen
