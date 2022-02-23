import { Wallet } from 'ethers'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import useAccounts from '@modules/common/hooks/useAccounts'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import { useNavigation } from '@react-navigation/native'

interface FormValues {
  password: string
}

const BiometricsSignScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const { state } = usePasscode()
  const { account } = useAccounts()
  const { addSelectedAccPassword, selectedAccHasPassword, removeSelectedAccPassword } =
    useAccountsPasswords()
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      password: ''
    }
  })

  const handleEnable = async ({ password }: FormValues) => {
    // Validation if the password is correct
    try {
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
      addToast(t('Passcode sign enabled!') as string, { timeout: 3000 })
      navigation.navigate('settings')
    }
  }

  const handleDisable = async () => {
    const disabled = await removeSelectedAccPassword()
    if (disabled) {
      addToast(t('Passcode sign disabled!') as string, { timeout: 3000 })
      navigation.navigate('settings')
    }
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

    if (state === PASSCODE_STATES.PASSCODE_ONLY) {
      return (
        <>
          <P type={TEXT_TYPES.DANGER}>
            {t('In order to enable it, first you need to enable local auth.')}
          </P>
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
          <P>{t('Enabled!')}</P>
          <Button text={t('Disable')} onPress={handleDisable} />
        </>
      )
    }

    return (
      <>
        <P>{t('To enable it, enter your Ambire account password.')}</P>
        <Controller
          control={control}
          rules={{ required: t('Please fill in a password.') as string }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t('Account password')}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
              autoCorrect={false}
              value={value}
            />
          )}
          name="password"
        />
        {!!errors.password && <P type={TEXT_TYPES.DANGER}>{errors.password.message}</P>}

        <Button
          disabled={isSubmitting}
          text={isSubmitting ? t('Enabling...') : t('Enable')}
          onPress={handleSubmit(handleEnable)}
        />
      </>
    )
  }

  return (
    <Wrapper>
      <P>
        {t(
          'You can opt-in to use the app passcode to sign transactions instead of your Ambire account password.'
        )}
      </P>
      {renderContent()}
    </Wrapper>
  )
}

export default BiometricsSignScreen
