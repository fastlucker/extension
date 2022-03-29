import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

import { useTranslation } from '@config/localization'
import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { isEmail } from '@modules/common/services/validate'

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
                <P type={TEXT_TYPES.DANGER}>{t('Please fill in a valid email.')}</P>
              )}

              <Button
                disabled={isSubmitting}
                text={isSubmitting ? t('Logging in...') : t('Log in')}
                onPress={handleSubmit(handleLogin)}
              />
              {!!err && <P type={TEXT_TYPES.DANGER}>{err}</P>}
              <P>
                {t(
                  'A password will not be required, we will send a magic login link to your email.'
                )}
              </P>
            </>
          )}
          {!!requiresEmailConfFor && (
            <P>
              {t(
                'We sent an email to {{email}}, please check your inbox and click Authorize New Device.',
                { email: requiresEmailConfFor?.email }
              )}
            </P>
          )}
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default EmailLoginScreen
