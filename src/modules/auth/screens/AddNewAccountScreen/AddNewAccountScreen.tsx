import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { Keyboard, Linking, TouchableWithoutFeedback } from 'react-native'

import { useTranslation } from '@config/localization'
import { ambireCloudURL, termsAndPrivacyURL } from '@modules/auth/constants/URLs'
import useAddNewAccount from '@modules/auth/hooks/useAddNewAccount'
import Button from '@modules/common/components/Button'
import Checkbox from '@modules/common/components/Checkbox'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import P from '@modules/common/components/P'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import accountPresets from '@modules/common/constants/accountPresets'
import { isEmail } from '@modules/common/services/validate'

const days = Math.ceil(accountPresets.quickAccTimelock / 86400)

const AddNewAccountScreen = () => {
  const { t } = useTranslation()
  const { handleAddNewAccount, err, addAccErr } = useAddNewAccount()
  const {
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      backup: true,
      noBackup: false
    }
  })

  return (
    <GradientBackgroundWrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        <Wrapper keyboardDismissMode="on-drag">
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
                error={errors.email && (t('Please fill in a valid email.') as string)}
                keyboardType="email-address"
              />
            )}
            name="email"
          />
          <Controller
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputPassword
                onBlur={onBlur}
                placeholder={t('Password')}
                onChangeText={onChange}
                value={value}
                error={errors.password && (t('Please fill in a valid password.') as string)}
              />
            )}
            name="password"
          />
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
                error={errors.confirmPassword && (t("Passwords don't match.") as string)}
                autoCorrect={false}
              />
            )}
            name="confirmPassword"
          />
          <Controller
            control={control}
            rules={{
              required: true
            }}
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

          {!!errors.terms && (
            <P type={TEXT_TYPES.DANGER}>
              {t('Please agree to our Terms of Service and Privacy policy')}
            </P>
          )}

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
          <Controller
            control={control}
            rules={{
              required: watch('backup', true) === false
            }}
            render={({ field: { onChange, value } }) =>
              watch('backup', true) === false ? (
                <Checkbox value={value} onValueChange={() => onChange(!value)}>
                  <Text onPress={() => onChange(!value)}>
                    {t(
                      'In case you forget your password or lose your backup, you will have to wait {{days}} days and pay the recovery fee to restore access to your account.',
                      { days }
                    )}
                  </Text>
                </Checkbox>
              ) : (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <></>
              )
            }
            name="noBackup"
          />
          {!!errors.noBackup && watch('backup', true) === false && (
            <P type={TEXT_TYPES.DANGER}>{t('Please tick this box if you want to proceed.')}</P>
          )}

          <Button
            disabled={isSubmitting}
            text={isSubmitting ? t('Signing up...') : t('Sign up')}
            onPress={handleSubmit(handleAddNewAccount)}
          />
          {!!err && <P type={TEXT_TYPES.DANGER}>{err}</P>}
          {!!addAccErr && <P type={TEXT_TYPES.DANGER}>{addAccErr}</P>}
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default AddNewAccountScreen
