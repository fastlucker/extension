import { Wallet } from 'ethers'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import useAccounts from '@modules/common/hooks/useAccounts'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import usePasscode from '@modules/common/hooks/usePasscode'
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
  const { state } = usePasscode()
  const { account } = useAccounts()
  const isFocused = useIsFocused()
  const { addSelectedAccPassword, selectedAccHasPassword, removeSelectedAccPassword } =
    useAccountsPasswords()
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
  }, [isFocused])

  const handleEnable = async ({ password }: FormValues) => {
    // Dismiss the keyboard, because the validation process sometimes takes longer,
    // and having the keyboard in there all the time, is strange.
    Keyboard.dismiss()

    // Validation if the password is correct
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
    if (!account.email) {
      return (
        <TextWarning appearance="info">
          {t(
            'This option is available only for accounts having Email/Password as a default signer.'
          )}
        </TextWarning>
      )
    }

    if (state === PASSCODE_STATES.NO_PASSCODE) {
      return (
        <>
          <TextWarning>
            {t('In order to enable it, first you need to create a passcode.')}
          </TextWarning>
          <Button
            text={t('Create passcode')}
            onPress={() => navigation.navigate('passcode-change')}
          />
        </>
      )
    }

    if (state === PASSCODE_STATES.PASSCODE_ONLY) {
      return (
        <>
          <TextWarning>
            {t('In order to enable it, first you need to enable local auth.')}
          </TextWarning>
          <Button
            text={t('Enable local auth')}
            onPress={() => navigation.navigate('local-auth-change')}
          />
        </>
      )
    }

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

    return (
      <>
        <Text type="small" style={spacings.mb}>
          {t('To enable it, enter your Ambire account password.')}
        </Text>
        <Controller
          control={control}
          rules={{ required: t('Please fill in a password.') as string }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPassword
              placeholder={t('Account password')}
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
          {t(
            'You can opt-in to use your phone biometrics to sign transactions instead of your Ambire account password.'
          )}
        </Text>
        {renderContent()}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default BiometricsSignScreen
