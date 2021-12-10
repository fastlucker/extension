import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Linking, Text, View } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Checkbox from '@modules/common/components/Checkbox'
import Input from '@modules/common/components/Input'
import P from '@modules/common/components/P'

import styles from './styles'

const AddNewAccountScreen = () => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      backup: true,
    },
  })

  return (
    <View style={styles.container}>
      {/* TODO: replace with heading */}
      <P style={{ alignSelf: 'center', fontSize: 24 }}>{t('Create a new account')}</P>
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
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Password')}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            autoCorrect={false}
          />
        )}
        name="password"
      />
      {!!errors.password && <P>{t('Please fill in a valid password')}</P>}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Confirm password')}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            autoCorrect={false}
          />
        )}
        name="confirmPassword"
      />
      {!!errors.confirmPassword && <P>{t('Please fill in a valid password confirmation')}</P>}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Checkbox value={value} onValueChange={() => onChange(!value)}>
            <Text>
              <Text onPress={() => onChange(!value)}>{'I agree to the '}</Text>
              <Text
                onPress={() =>
                  Linking.openURL(
                    'https://www.ambire.com/Ambire%20ToS%20and%20PP%20(26%20November%202021).pdf'
                  )
                }
              >
                Terms of Service and Privacy policy
              </Text>
            </Text>
          </Checkbox>
        )}
        name="terms"
      />
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox value={value} onValueChange={() => onChange(!value)}>
            <Text>
              <Text onPress={() => onChange(!value)}>{'Backup on '}</Text>
              <Text
                onPress={() =>
                  Linking.openURL(
                    'https://help.ambire.com/hc/en-us/articles/4410892186002-What-is-Ambire-Cloud-'
                  )
                }
              >
                Ambire Cloud.
              </Text>
            </Text>
          </Checkbox>
        )}
        name="backup"
      />
      {!!errors.terms && <P>{t('Please agree to our Terms of Service and Privacy policy')}</P>}

      <Button
        disabled={isSubmitting}
        text={isSubmitting ? t('Signing up...') : t('Sign up')}
        onPress={handleSubmit(() => {})}
      />
    </View>
  )
}

export default AddNewAccountScreen
