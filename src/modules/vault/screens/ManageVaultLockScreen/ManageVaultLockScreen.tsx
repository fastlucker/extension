import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import InputPassword from '@common/components/InputPassword'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import TextWarning from '@common/components/TextWarning'
import Toggle from '@common/components/Toggle'
import Wrapper from '@common/components/Wrapper'
import { DEVICE_SECURITY_LEVEL } from '@common/contexts/biometricsContext/constants'
import useBiometrics from '@common/hooks/useBiometrics'
import useIsScreenFocused from '@common/hooks/useIsScreenFocused'
import useToast from '@common/hooks/useToast'
import alert from '@common/services/alert'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { useTranslation } from '@config/localization'
import ManageLockVaultWhenInactive from '@modules/vault/components/ManageLockVaultWhenInactive'
import useVault from '@modules/vault/hooks/useVault'

import styles from './styles'

interface FormValues {
  password: string
}

const ManageVaultLockScreen = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const isFocused = useIsScreenFocused()
  const { hasBiometricsHardware, deviceSecurityLevel } = useBiometrics()
  const {
    isValidPassword,
    addKeystorePasswordToDeviceSecureStore,
    biometricsEnabled,
    removeKeystorePasswordFromDeviceSecureStore
  } = useVault()
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
        { type: 'focus', message: t('Wrong Ambire Key Store passphrase.') },
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
        'Disabling biometrics will require you to manually input your Ambire Key Store passphrase when needed.'
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
            {t('You can opt-in to use your phone biometrics to unlock your Ambire Key Store.')}
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
            'You can opt-in to use your phone biometrics to unlock your Ambire Key Store. To enable it, enter your Ambire Key Store passphrase.'
          )}
        </Text>
        <Controller
          control={control}
          rules={{ required: t('Please fill in a passphrase.') as string }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPassword
              placeholder={t('Ambire Key Store passphrase')}
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

export default ManageVaultLockScreen
