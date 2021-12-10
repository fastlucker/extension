import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'

import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'

import styles from './styles'
import { useTranslation } from '@config/localization'

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
          {errors.email && <Text>{t('Please fill in this field')}</Text>}

          <Button
            disabled={isSubmitting}
            text={isSubmitting ? t('Logging in...') : t('Log in')}
            onPress={handleSubmit(handleLogin)}
          />

          <Text>
            {t('A password will not be required, we will send a magic login link to your email.')}
          </Text>
        </>
      )}
      {!!requiresEmailConfFor && (
        <Text>{`We sent an email to ${requiresEmailConfFor?.email}, please check your inbox and click Authorize New Device`}</Text>
      )}
    </View>
  )
}

export default EmailLoginScreen
