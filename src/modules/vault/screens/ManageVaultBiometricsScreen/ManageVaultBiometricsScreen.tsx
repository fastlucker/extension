import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import InputPassword from '@modules/common/components/InputPassword'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import Toggle from '@modules/common/components/Toggle'
import Wrapper from '@modules/common/components/Wrapper'
import { DEVICE_SECURITY_LEVEL } from '@modules/common/contexts/biometricsContext/constants'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import useToast from '@modules/common/hooks/useToast'
import alert from '@modules/common/services/alert'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import ManageLockVaultWhenInactive from '@modules/vault/components/ManageLockVaultWhenInactive'
import useVault from '@modules/vault/hooks/useVault'
import useVaultBiometrics from '@modules/vault/hooks/useVaultBiometrics'
import { useIsFocused } from '@react-navigation/native'

import styles from './styles'

interface FormValues {
  password: string
}

const ManageVaultBiometricsScreen = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const isFocused = useIsFocused()
  const { hasBiometricsHardware, deviceSecurityLevel } = useBiometrics()
  const {
    addKeystorePasswordToDeviceSecureStore,
    biometricsEnabled,
    removeKeystorePasswordFromDeviceSecureStore
  } = useVaultBiometrics()
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

    let enable = false
    try {
      enable = await addKeystorePasswordToDeviceSecureStore(password)
      if (enable) {
        addToast(t('Unlock with biometrics enabled!') as string, { timeout: 3000 })
      }
    } catch {
      addToast(t('Confirming Biometrics was unsuccessful. Please try again.'), { error: true })
    }

    return enable
  }

  const handleDisableConfirmed = async () => {
    const disabled = await removeKeystorePasswordFromDeviceSecureStore()
    if (disabled) {
      addToast(t('Unlock with biometrics disabled!') as string, { timeout: 3000 })
    }
  }

  const handleDisable = () => {
    alert(
      t('Are you sure you want to disable biometrics?'),
      t(
        'Disabling biometrics will require you to manually input your Ambire Keystore passphrase when needed.'
      ),
      [
        {
          text: t('Disable biometrics'),
          onPress: handleDisableConfirmed,
          style: 'destructive'
        },
        {
          text: t('Cancel'),
          style: 'cancel'
        }
      ]
    )
  }

  const renderContent = () => {
    if (biometricsEnabled) {
      return (
        <Panel
          type="filled"
          contentContainerStyle={styles.appLockingItemContainer}
          style={spacings.mb}
        >
          <Text fontSize={16} weight="regular" numberOfLines={1} style={flexboxStyles.flex1}>
            {t('Unlock with Biometrics')}
          </Text>
          <Toggle isOn={biometricsEnabled} label={t('Enabled')} onToggle={handleDisable} />
        </Panel>
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
        <>
          <Text type="small" style={spacings.mbLg}>
            {t('You can opt-in to use your phone biometrics to unlock your Ambire Keystore.')}
          </Text>
          <TextWarning appearance="info">
            {t(
              'This device supports biometric authentication, but you have not enrolled it on this device. If you want to use it - enroll it first on your device.'
            )}
          </TextWarning>
        </>
      )
    }

    return (
      <>
        <Text type="small" style={spacings.mb}>
          {t(
            'You can opt-in to use your phone biometrics to unlock your Ambire Keystore. To enable it, enter your Ambire Keystore password.'
          )}
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
              containerStyle={spacings.mbTy}
            />
          )}
          name="password"
        />
        <Button
          disabled={isSubmitting}
          text={isSubmitting ? t('Validating...') : t('Enable')}
          onPress={handleSubmit(handleEnable)}
          style={spacings.mbLg}
        />
      </>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        {renderContent()}
        <ManageLockVaultWhenInactive />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ManageVaultBiometricsScreen
