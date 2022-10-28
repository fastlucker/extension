import { isEmail } from 'ambire-common/src/services/validations'
import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
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

  const { handleLogin, cancelLoginAttempts, requiresEmailConfFor, err } = useEmailLogin()

  const handleFormSubmit = useCallback(() => {
    handleSubmit(handleLogin)()
  }, [])

  return (
    <>
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
            {t('A password will not be required, we will send a magic login link to your email.')}
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
          {isWeb && (
            <Button type="danger" text={t('Cancel login attempt')} onPress={cancelLoginAttempts} />
          )}
        </>
      )}
    </>
  )
}

export default EmailLoginScreen
