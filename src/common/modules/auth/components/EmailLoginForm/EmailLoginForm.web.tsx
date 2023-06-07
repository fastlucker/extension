import { isEmail } from 'ambire-common/src/services/validations'
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import Text from '@common/components/Text'
import Checkbox from '@common/components/Checkbox'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import useEmailLogin from '@common/modules/auth/hooks/useEmailLogin'
import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'
import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import { delayPromise } from '@common/utils/promises'
import EmailAnimation from './EmailAnimation'

const EmailLoginForm: React.FC<any> = ({ createEmailVault }) => {
  const { t } = useTranslation()
  const { themeType } = useTheme()
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      email: ''
    }
  })

  const { updateStepperState } = useStepper()

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
    if (!requiresEmailConfFor) setValue('email', '')
  }, [requiresEmailConfFor, setValue])

  const handleFormSubmit = useCallback(() => {
    !isWeb && Keyboard.dismiss()
    handleSubmit(async ({ email }) => {
      // wait state update before Wallet calcs because
      // when Wallet method is called on devices with slow CPU the UI freezes
      await delayPromise(100)

      await handleLogin({ email })
      await updateStepperState(1, 'emailAuth')
    })()
  }, [handleSubmit, handleLogin, updateStepperState])

  const handleCancelLoginAttempts = useCallback(() => {
    setValue('email', '')
    cancelLoginAttempts()
  }, [cancelLoginAttempts, setValue])

  return (
    <>
      {requiresEmailConfFor && !pendingLoginAccount && (
        <>
          <EmailAnimation />
          <Text fontSize={14} weight="regular" style={{ textAlign: 'center', marginBottom: 47 }}>
            {t(
              'We sent an email to {{email}}, please check your inbox and click Authorize New Device.',
              { email: requiresEmailConfFor?.email }
            )}
          </Text>
        </>
      )}
      {!(requiresEmailConfFor && !pendingLoginAccount) && (
        <Controller
          control={control}
          rules={{ validate: isEmail }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={
                !requiresEmailConfFor || !pendingLoginAccount ? t('Please insert your email') : ''
              }
              onBlur={onBlur}
              placeholder={t('Email Address')}
              onChangeText={onChange}
              onSubmitEditing={handleSubmit(handleLogin)}
              value={value}
              autoFocus={isWeb}
              isValid={isEmail(value)}
              validLabel={pendingLoginAccount ? t('Email address confirmed') : ''}
              disabled={!!requiresEmailConfFor && !pendingLoginAccount}
              error={errors.email && (t('Please fill in a valid email.') as string)}
              containerStyle={requiresPassword ? spacings.mbTy : null}
            />
          )}
          name="email"
        />
      )}
      {createEmailVault && !requiresEmailConfFor && !pendingLoginAccount && (
        <Checkbox
          uncheckedIconColor={colors.martinique}
          checkedIconColor={colors.greenHaze}
          label={t('Enable local key store recovery with email')}
        />
      )}
      {!requiresEmailConfFor && !pendingLoginAccount && (
        <Button
          textStyle={{ fontSize: 14 }}
          disabled={
            (!!requiresEmailConfFor && !pendingLoginAccount) || isSubmitting || !watch('email', '')
          }
          type="primary"
          text={
            // eslint-disable-next-line no-nested-ternary
            isSubmitting ? t('Loading...') : !pendingLoginAccount ? t('Continue') : t('Log In')
          }
          onPress={handleFormSubmit}
        />
      )}
      {requiresEmailConfFor && !pendingLoginAccount && (
        <Text
          fontSize={14}
          style={{ ...flexbox.alignSelfCenter, marginBottom: 60 }}
          color={colors.violet}
        >
          {t('Waiting Email Confirmation')}
        </Text>
      )}
      {!!requiresEmailConfFor && (
        <Text
          underline
          fontSize={14}
          style={[flexbox.alignSelfCenter]}
          color={themeType === THEME_TYPES.LIGHT ? colors.howl : undefined}
          onPress={handleCancelLoginAttempts}
        >
          {t('Cancel Login Attempt')}
        </Text>
      )}
    </>
  )
}

export default EmailLoginForm
