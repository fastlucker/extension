import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import EmailAnimation from '@common/modules/auth/components/EmailAnimation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { isEmail } from '@common/services/validations/validate'
import colors from '@common/styles/colors'
// import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { delayPromise } from '@common/utils/promises'

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
  // TODO: v2
  const requiresEmailConfFor = false
  const pendingLoginAccount = false

  const handleFormSubmit = useCallback(() => {
    !isWeb && Keyboard.dismiss()
    handleSubmit(async ({ email }) => {
      // wait state update before Wallet calcs because
      // when Wallet method is called on devices with slow CPU the UI freezes
      await delayPromise(100)

      // TODO: v2
      await updateStepperState(1, 'emailAuth')
    })()
  }, [handleSubmit, updateStepperState])

  const handleCancelLoginAttempts = useCallback(() => {
    // TODO: v2
  }, [])

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
              // TODO: v2
              // onSubmitEditing={handleSubmit(handleLogin)}
              value={value}
              autoFocus={isWeb}
              isValid={isEmail(value)}
              validLabel={pendingLoginAccount ? t('Email address confirmed') : ''}
              disabled={!!requiresEmailConfFor && !pendingLoginAccount}
              error={errors.email && (t('Please fill in a valid email.') as string)}
              // containerStyle={requiresPassword ? spacings.mbTy : null}
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
