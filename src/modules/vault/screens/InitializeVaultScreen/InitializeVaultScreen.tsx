import { isValidPassword } from 'ambire-common/src/services/validations'
import React, { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import useVault from '@modules/vault/hooks/useVault'

const InitializeVaultScreen = ({ route }: any) => {
  const { t } = useTranslation()
  const { createVault, resetVault } = useVault()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
      nextRoute: route.params?.nextRoute
    }
  })

  const isResetPassword = useMemo(() => route.params?.resetPassword, [route.params?.resetPassword])

  useEffect(() => {
    setValue('nextRoute', 'auth')
  }, [isResetPassword, setValue])

  return (
    <GradientBackgroundWrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          !isWeb && Keyboard.dismiss()
        }}
      >
        <Wrapper
          contentContainerStyle={spacings.pbLg}
          type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW}
          extraHeight={220}
        >
          <AmbireLogo shouldExpand={false} />
          <View style={[spacings.mbLg, spacings.ph, flexboxStyles.flex1, flexboxStyles.justifyEnd]}>
            {isResetPassword ? (
              <>
                <Text weight="regular" style={spacings.mbMi}>
                  {t(
                    'Ambire does not keep a copy of your lock password. If you’re having trouble unlocking your extension, you will need to create a new password.'
                  )}
                </Text>
                <Text weight="regular" style={spacings.mb}>
                  {t('This action will remove all your accounts from this device!')}
                </Text>
              </>
            ) : (
              <Text weight="regular" style={spacings.mb}>
                {t('Choose a password to protect your accounts/wallets on this device')}
              </Text>
            )}

            <Controller
              control={control}
              rules={{ validate: isValidPassword }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputPassword
                  onBlur={onBlur}
                  placeholder={isResetPassword ? t('New password') : t('Password')}
                  onChangeText={onChange}
                  isValid={isValidPassword(value)}
                  value={value}
                  error={
                    errors.password &&
                    (t('Please fill in at least 8 characters for password.') as string)
                  }
                  containerStyle={spacings.mbTy}
                />
              )}
              name="password"
            />
            <Controller
              control={control}
              rules={{
                validate: (value) => watch('password', '') === value
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  placeholder={t('Confirm password')}
                  onChangeText={onChange}
                  value={value}
                  isValid={!!value && watch('password', '') === value}
                  secureTextEntry
                  error={errors.confirmPassword && (t("Passwords don't match.") as string)}
                  autoCorrect={false}
                />
              )}
              name="confirmPassword"
            />

            <View style={spacings.ptSm}>
              <Button
                disabled={isSubmitting || !watch('password', '') || !watch('confirmPassword', '')}
                text={
                  // eslint-disable-next-line no-nested-ternary
                  isSubmitting
                    ? t('Creating...')
                    : isResetPassword
                    ? t('Create New Password')
                    : t('Create Password')
                }
                onPress={handleSubmit(isResetPassword ? resetVault : createVault)}
              />
            </View>
          </View>
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default InitializeVaultScreen
