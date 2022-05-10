import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import { isEmail } from '@modules/common/services/validate'
import spacings from '@modules/common/styles/spacings'

const EmailLoginScreen = () => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      email: ''
    }
  })

  const { handleLogin, requiresEmailConfFor, err } = useEmailLogin()

  const handleFormSubmit = useCallback(() => {
    handleSubmit(handleLogin)()
  }, [])

  return (
    <GradientBackgroundWrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        <Wrapper
          contentContainerStyle={spacings.pbLg}
          type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW}
          extraHeight={220}
        >
          <AmbireLogo />
          {!requiresEmailConfFor && (
            <>
              <Controller
                control={control}
                rules={{ validate: isEmail }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onBlur={onBlur}
                    placeholder={t('Email')}
                    onChangeText={onChange}
                    onSubmitEditing={handleFormSubmit}
                    value={value}
                    isValid={isEmail(value)}
                    keyboardType="email-address"
                    error={errors.email && (t('Please fill in a valid email.') as string)}
                  />
                )}
                name="email"
              />
              <View style={spacings.mbTy}>
                <Button
                  disabled={isSubmitting || !watch('email', '')}
                  type="outline"
                  text={isSubmitting ? t('Logging in...') : t('Log In')}
                  onPress={handleFormSubmit}
                />
              </View>
              {!!err && (
                <Text appearance="danger" style={spacings.mbSm}>
                  {err}
                </Text>
              )}
              <Text style={spacings.mbSm} fontSize={12}>
                {t(
                  'A password will not be required, we will send a magic login link to your email.'
                )}
              </Text>
            </>
          )}
          {!!requiresEmailConfFor && (
            <>
              <Title hasBottomSpacing={false} style={spacings.mbSm}>
                {t('Email Login')}
              </Title>
              <Text style={spacings.mbSm} fontSize={12}>
                {t(
                  'We sent an email to {{email}}, please check your inbox and click Authorize New Device.',
                  { email: requiresEmailConfFor?.email }
                )}
              </Text>
            </>
          )}
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default EmailLoginScreen
