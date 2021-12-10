import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import P from '@modules/common/components/P'

import styles from './styles'

const EmailLoginScreen = () => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
    },
  })

  const { handleLogin, requiresEmailConfFor } = useEmailLogin()

  return (
    <View style={styles.container}>
      {!requiresEmailConfFor && (
        <>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
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
          {!!errors.email && <P>{t('Please fill in this field')}</P>}

          <Button
            disabled={isSubmitting}
            text={isSubmitting ? t('Logging in...') : t('Log in')}
            onPress={handleSubmit(handleLogin)}
          />

          <P>
            {t('A password will not be required, we will send a magic login link to your email.')}
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
    </View>
  )
}

export default EmailLoginScreen
