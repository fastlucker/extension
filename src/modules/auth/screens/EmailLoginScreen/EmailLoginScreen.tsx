import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

import { useTranslation } from '@config/localization'
import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { isEmail } from '@modules/common/services/validate'
import spacings from '@modules/common/styles/spacings'

const EmailLoginScreen = () => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: ''
    }
  })

  const { handleLogin, requiresEmailConfFor, err } = useEmailLogin()

  return (
    <GradientBackgroundWrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        <Wrapper>
          <Title>{t('Email login')}</Title>
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
                    value={value}
                    keyboardType="email-address"
                  />
                )}
                name="email"
              />
              {!!errors.email && (
                <Text appearance="danger" style={spacings.mbSm}>
                  {t('Please fill in a valid email.')}
                </Text>
              )}

              <Button
                disabled={isSubmitting}
                text={isSubmitting ? t('Logging in...') : t('Log in')}
                onPress={handleSubmit(handleLogin)}
              />
              {!!err && (
                <Text appearance="danger" style={spacings.mbSm}>
                  {err}
                </Text>
              )}
              <Text style={spacings.mbSm}>
                {t(
                  'A password will not be required, we will send a magic login link to your email.'
                )}
              </Text>
            </>
          )}
          {!!requiresEmailConfFor && (
            <Text style={spacings.mbSm}>
              {t(
                'We sent an email to {{email}}, please check your inbox and click Authorize New Device.',
                { email: requiresEmailConfFor?.email }
              )}
            </Text>
          )}
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default EmailLoginScreen
