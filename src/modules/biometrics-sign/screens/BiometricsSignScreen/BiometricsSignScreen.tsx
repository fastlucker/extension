import { Wallet } from 'ethers'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { useTranslation } from '@config/localization'
import useExternalSigners from '@modules/auth/hooks/useExternalSignerLogin'
import useBiometricsSign from '@modules/biometrics-sign/hooks/useBiometricsSign'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import Wrapper from '@modules/common/components/Wrapper'
import { DEVICE_SECURITY_LEVEL } from '@modules/common/contexts/biometricsContext/constants'
import useAccounts from '@modules/common/hooks/useAccounts'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import { delayPromise } from '@modules/common/utils/promises'
import { useIsFocused, useNavigation } from '@react-navigation/native'

interface FormValues {
  password: string
}

const BiometricsSignScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const { account } = useAccounts()
  const isFocused = useIsFocused()
  const { hasBiometricsHardware, deviceSecurityLevel } = useBiometrics()
  // TODO: Wire-up with the Vault instead
  const { decryptExternalSigner, externalSigners } = useExternalSigners()
  const { addSelectedAccPassword, selectedAccHasPassword, removeSelectedAccPassword } =
    useBiometricsSign()
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

  const isExternalSigner = externalSigners[account.signer?.address]

  const handleEnable = async ({ password }: FormValues) => {
    // Dismiss the keyboard, because the validation process sometimes takes longer,
    // and having the keyboard in there all the time, is strange.
    Keyboard.dismiss()

    // Validation if the password is correct for Email/Password accounts
    if (account.email) {
      try {
        // For some reason, the `isSubmitting` flag doesn't flip immediately
        // when the `Wallet.fromEncryptedJson` promise fires.
        // Triggering this dummy promise delay flips the `isSubmitting` flag.
        await delayPromise(100)

        await Wallet.fromEncryptedJson(JSON.parse(account.primaryKeyBackup), password)
      } catch (e) {
        return setError(
          'password',
          { type: 'focus', message: t('Invalid password.') },
          { shouldFocus: true }
        )
      }
    }

    // Validation if the password is correct for External Signers.
    if (isExternalSigner) {
      const isDecrypted = !!(await decryptExternalSigner({
        signerPublicAddr: account.signer?.address,
        password
      }))
      if (!isDecrypted) {
        return setError(
          'password',
          { type: 'focus', message: t('Invalid password.') },
          { shouldFocus: true }
        )
      }
    }

    const enable = await addSelectedAccPassword(password)
    if (enable) {
      addToast(t('Biometrics sign enabled!') as string, { timeout: 3000 })
      navigation.navigate('dashboard')
    }
    return enable
  }

  const handleDisable = async () => {
    const disabled = await removeSelectedAccPassword()
    if (disabled) {
      addToast(t('Biometrics sign disabled!') as string, { timeout: 3000 })
      navigation.navigate('dashboard')
    }
  }

  const renderContent = () => {
    if (selectedAccHasPassword) {
      return (
        <>
          <Text type="small" weight="medium" style={spacings.mb}>
            {t('Enabled!')}
          </Text>
          <Button text={t('Disable')} onPress={handleDisable} />
        </>
      )
    }

    if (!account.email && !isExternalSigner) {
      return (
        <TextWarning appearance="info">
          {t(
            'This option is only available for Ambire accounts having Email/Password or External Signer as a default signer.'
          )}
        </TextWarning>
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
          {t('To enable it, enter your {{password}}.', {
            password: isExternalSigner
              ? t('external signer password')
              : t('Ambire account password')
          })}
        </Text>
        <Controller
          control={control}
          rules={{ required: t('Please fill in a password.') as string }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPassword
              placeholder={isExternalSigner ? t('External signer password') : t('Account password')}
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
        {isSubmitting && (
          <Text type="small">{t('Validation might take up to a minute. Please be patient.')}</Text>
        )}
      </>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Text type="small" style={spacings.mbLg}>
          {t(
            'You can opt-in to use your phone biometrics to sign transactions instead of your {{password}}.',
            {
              password: isExternalSigner
                ? t('external signer password')
                : t('Ambire account password')
            }
          )}
        </Text>
        {renderContent()}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default BiometricsSignScreen
