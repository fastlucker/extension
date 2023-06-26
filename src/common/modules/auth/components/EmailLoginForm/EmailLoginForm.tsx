import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { Keyboard } from 'react-native'

import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import EmailAnimation from '@common/modules/auth/components/EmailAnimation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { ROUTES } from '@common/modules/router/constants/common'
import { isEmail } from '@common/services/validations/validate'
import colors from '@common/styles/colors'
import { SPACING_LG, SPACING_MD } from '@common/styles/spacings'
// import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import { delayPromise } from '@common/utils/promises'

const EmailLoginForm: React.FC<any> = ({ createEmailVault }) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
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

  const { updateStepperState, stepperState } = useStepper()
  // TODO: v2
  const requiresEmailConfFor = !!stepperState.currentStep
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

  useEffect(() => {
    let timer
    const delay = 4
    if (stepperState.currentStep === 1) {
      setTimeout(() => {
        updateStepperState(2, 'emailAuth')
        navigate(ROUTES.createKeyStore)
      }, delay * 1000)
    }

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    return () => {
      clearTimeout(timer)
    }
  }, [stepperState.currentStep])

  return (
    <>
      {requiresEmailConfFor && !pendingLoginAccount && (
        <>
          <EmailAnimation />
          <Text
            fontSize={14}
            weight="regular"
            style={[text.center, { marginBottom: SPACING_MD * 2 }]}
          >
            {t(
              'We sent an email to {{email}}, please check your inbox and click Authorize New Device.',
              { email: 'email@gmail.com' }
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
          label={
            <Trans>
              Enable <strong>local</strong> key store recovery with email
            </Trans>
          }
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
          style={{ ...flexbox.alignSelfCenter, marginBottom: SPACING_LG * 2 }}
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
