import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { Keyboard, Linking, TouchableWithoutFeedback } from 'react-native'

import { useTranslation } from '@config/localization'
import { ambireCloudURL, termsAndPrivacyURL } from '@modules/auth/constants/URLs'
import useAddNewAccount from '@modules/auth/hooks/useAddNewAccount'
import Button from '@modules/common/components/Button'
import Checkbox from '@modules/common/components/Checkbox'
import Heading from '@modules/common/components/Heading'
import Input from '@modules/common/components/Input'
import P from '@modules/common/components/P'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { isEmail } from '@modules/common/services/validate'

const AddNewAccountScreen = () => {
  const { t } = useTranslation()
  const { handleAddNewAccount, err, addAccErr } = useAddNewAccount()
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      backup: true
    }
  })

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss()
      }}
    >
      <Wrapper>
        <Title>{t('Create a new account')}</Title>
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
        {!!errors.email && <P type={TEXT_TYPES.DANGER}>{t('Please fill in a valid email.')}</P>}
        <Controller
          control={control}
          rules={{
            required: true
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
        {!!errors.password && (
          <P type={TEXT_TYPES.DANGER}>{t('Please fill in a valid password.')}</P>
        )}
        <Controller
          control={control}
          rules={{
            validate: (field) => getValues('password') === field
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
        {!!errors.confirmPassword && <P type={TEXT_TYPES.DANGER}>{t("Passwords don't match.")}</P>}
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Checkbox value={value} onValueChange={() => onChange(!value)}>
              <Trans t={t}>
                <Text>
                  <Text onPress={() => onChange(!value)}>{'I agree to the '}</Text>
                  <Text onPress={() => Linking.openURL(termsAndPrivacyURL)} underline>
                    Terms of Service and Privacy policy.
                  </Text>
                </Text>
              </Trans>
            </Checkbox>
          )}
          name="terms"
        />
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Checkbox value={value} onValueChange={() => onChange(!value)}>
              <Trans t={t}>
                <Text>
                  <Text onPress={() => onChange(!value)}>{'Backup on '}</Text>
                  <Text onPress={() => Linking.openURL(ambireCloudURL)} underline>
                    Ambire Cloud.
                  </Text>
                </Text>
              </Trans>
            </Checkbox>
          )}
          name="backup"
        />
        {!!errors.terms && <P>{t('Please agree to our Terms of Service and Privacy policy')}</P>}

        <Button
          disabled={isSubmitting}
          text={isSubmitting ? t('Signing up...') : t('Sign up')}
          onPress={handleSubmit(handleAddNewAccount)}
        />
        {!!err && <P type={TEXT_TYPES.DANGER}>{err}</P>}
        {!!addAccErr && <P type={TEXT_TYPES.DANGER}>{addAccErr}</P>}
      </Wrapper>
    </TouchableWithoutFeedback>
  )
}

export default AddNewAccountScreen
