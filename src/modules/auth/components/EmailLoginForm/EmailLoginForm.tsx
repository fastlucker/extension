import { isEmail, isValidPassword } from 'ambire-common/src/services/validations'
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import spacings from '@modules/common/styles/spacings'
import { delayPromise } from '@modules/common/utils/promises'

const EmailLoginScreen = () => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    handleLogin,
    cancelLoginAttempts,
    requiresEmailConfFor,
    requiresPassword,
    pendingLoginAccount
  } = useEmailLogin()

  useEffect(() => {
    if (requiresEmailConfFor) {
      setValue('email', requiresEmailConfFor?.email || '')
    }
  }, [requiresEmailConfFor, setValue])

  const handleFormSubmit = useCallback(() => {
    !isWeb && Keyboard.dismiss()

    handleSubmit(async ({ email, password }) => {
      // wait state update before Wallet calcs because
      // when Wallet method is called on devices with slow CPU the UI freezes
      await delayPromise(100)

      await handleLogin({ email, password })
    })()
  }, [handleSubmit, handleLogin])

  const handleCancelLoginAttempts = useCallback(() => {
    setValue('email', '')
    cancelLoginAttempts()
  }, [cancelLoginAttempts, setValue])

  return (
    <>
      <Controller
        control={control}
        rules={{ validate: isEmail }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Email')}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(handleLogin)}
            value={value}
            autoFocus={isWeb}
            isValid={isEmail(value)}
            validLabel={pendingLoginAccount ? t('Email address confirmed') : ''}
            keyboardType="email-address"
            disabled={!!requiresEmailConfFor || !!pendingLoginAccount}
            info={
              requiresEmailConfFor && !pendingLoginAccount
                ? t(
                    'We sent an email to {{email}}, please check your inbox and click Authorize New Device.',
                    { email: requiresEmailConfFor?.email }
                  )
                : ''
            }
            error={errors.email && (t('Please fill in a valid email.') as string)}
            containerStyle={requiresPassword ? spacings.mbTy : null}
          />
        )}
        name="email"
      />
      {requiresPassword && (
        <Controller
          control={control}
          rules={{ validate: isValidPassword }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPassword
              onBlur={onBlur}
              placeholder={t('Account password')}
              onChangeText={onChange}
              isValid={isValidPassword(value)}
              autoFocus
              disabled={isSubmitting}
              value={value}
              info={t('Enter the password for account {{accountAddr}}', {
                // eslint-disable-next-line no-underscore-dangle
                accountAddr: `${pendingLoginAccount?._id?.slice(
                  0,
                  4
                )}...${pendingLoginAccount?._id?.slice(-4)}`
              })}
              error={
                errors.password &&
                (t('Please fill in at least 8 characters for password.') as string)
              }
              onSubmitEditing={handleFormSubmit}
            />
          )}
          name="password"
        />
      )}
      <Button
        disabled={
          (!!requiresEmailConfFor && !pendingLoginAccount) ||
          isSubmitting ||
          !watch('email', '') ||
          (pendingLoginAccount && !watch('password', ''))
        }
        type="outline"
        text={
          // eslint-disable-next-line no-nested-ternary
          requiresEmailConfFor && !pendingLoginAccount
            ? t('Waiting Email Confirmation')
            : // eslint-disable-next-line no-nested-ternary
            isSubmitting
            ? t('Loading...')
            : !pendingLoginAccount
            ? t('Confirm Email')
            : t('Log In')
        }
        onPress={handleFormSubmit}
      />
      {!!requiresEmailConfFor && (
        <Button type="ghost" text={t('Cancel Login Attempt')} onPress={handleCancelLoginAttempts} />
      )}
    </>
  )
}

export default EmailLoginScreen
