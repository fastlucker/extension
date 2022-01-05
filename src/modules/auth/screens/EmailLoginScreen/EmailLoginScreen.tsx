import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import { useTranslation } from '@config/localization'
import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import Heading from '@modules/common/components/Heading'
import Input from '@modules/common/components/Input'
import P from '@modules/common/components/P'
import { isEmail } from '@modules/common/services/validate'

import styles from './styles'

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
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss()
      }}
    >
      <View style={styles.container}>
        <Heading>{t('Email login')}</Heading>
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
            {!!errors.email && <P>{t('Please fill in a valid email.')}</P>}

            <Button
              disabled={isSubmitting}
              text={isSubmitting ? t('Logging in...') : t('Log in')}
              onPress={handleSubmit(handleLogin)}
            />
            {!!err && <P>{err}</P>}
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
    </TouchableWithoutFeedback>
  )
}

export default EmailLoginScreen
