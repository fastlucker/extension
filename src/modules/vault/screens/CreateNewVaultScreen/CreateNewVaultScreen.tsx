import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import Toggle from '@modules/common/components/Toggle'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import LockBackground from '@modules/vault/components/LockBackground'
import useVault from '@modules/vault/hooks/useVault'

const CreateNewVaultScreen = ({ route }: any) => {
  const { t } = useTranslation()
  const { createVault } = useVault()

  const {
    control,
    handleSubmit,
    watch,

    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
      optInForBiometricsUnlock: !isWeb,
      nextRoute: route.params?.nextRoute || 'auth'
    }
  })

  return (
    <GradientBackgroundWrapper>
      <LockBackground />
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
          <View
            style={[
              !isWeb ? spacings.mbLg : spacings.mb0,
              isWeb && spacings.ph,
              flexboxStyles.flex1,
              flexboxStyles.justifyEnd
            ]}
          >
            <View style={[spacings.mb, spacings.phTy]}>
              <Text weight="light" style={spacings.mbTy} color={colors.titan} fontSize={12}>
                {t('Welcome to the Ambire Wallet extension. Let’s set up your Key Store password.')}
              </Text>
              <Text weight="light" style={spacings.mbTy} color={colors.titan} fontSize={12}>
                {t(
                  '1.  Ambire Key Store will protect your Ambire wallet with email password or external signer on this device.'
                )}
              </Text>
              <Text weight="light" style={spacings.mbTy} color={colors.titan} fontSize={12}>
                {t(
                  '2.  First, pick your Ambire Key Store passphrase. It is unique for this device and it should be different from your account password.'
                )}
              </Text>
              <Text weight="light" color={colors.titan} fontSize={12}>
                {t(
                  '3.  You will use your passphrase to unlock the Ambire extension and sign transactions on this device.'
                )}
              </Text>
            </View>

            <Controller
              control={control}
              rules={{ validate: isValidPassword }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputPassword
                  onBlur={onBlur}
                  placeholder={t('Password')}
                  onChangeText={onChange}
                  isValid={isValidPassword(value)}
                  autoFocus={isWeb}
                  value={value}
                  error={
                    errors.password &&
                    (t('Please fill in at least 8 characters for password.') as string)
                  }
                  containerStyle={spacings.mbTy}
                  onSubmitEditing={handleSubmit(createVault)}
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
                  onSubmitEditing={handleSubmit(createVault)}
                  containerStyle={spacings.mbSm}
                />
              )}
              name="confirmPassword"
            />
            {!isWeb && (
              <View style={[spacings.mbLg, flexboxStyles.alignEnd]}>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Toggle isOn={value} label={t('Biometrics unlock?')} onToggle={onChange} />
                  )}
                  name="optInForBiometricsUnlock"
                />
              </View>
            )}

            <Button
              disabled={isSubmitting || !watch('password', '') || !watch('confirmPassword', '')}
              text={isSubmitting ? t('Setting up...') : t('Setup Ambire Key Store')}
              onPress={handleSubmit(createVault)}
            />
          </View>
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default CreateNewVaultScreen
