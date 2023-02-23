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
import { DEVICE_SECURITY_LEVEL } from '@modules/common/contexts/biometricsContext/constants'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import useRoute from '@modules/common/hooks/useRoute'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import KeyStoreLogo from '@modules/vault/components/KeyStoreLogo'
import useVault from '@modules/vault/hooks/useVault'

const CreateNewVaultScreen = () => {
  const { t } = useTranslation()
  const route = useRoute()
  const { createVault } = useVault()
  const { hasBiometricsHardware, deviceSecurityLevel } = useBiometrics()
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
      optInForBiometricsUnlock:
        !isWeb && hasBiometricsHardware && deviceSecurityLevel === DEVICE_SECURITY_LEVEL.BIOMETRIC,
      nextRoute: route?.params?.nextRoute || 'auth'
    }
  })

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
          <KeyStoreLogo />
          <View style={[isWeb && spacings.ph, flexboxStyles.flex1, flexboxStyles.justifyEnd]}>
            <Text
              weight="light"
              style={[spacings.mbTy, spacings.phTy]}
              color={colors.titan}
              fontSize={13}
            >
              {t(
                'The Ambire Key Store passphrase should be unique for this device and it should be different from your account password.'
              )}
            </Text>

            <Controller
              control={control}
              rules={{ validate: isValidPassword }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputPassword
                  onBlur={onBlur}
                  placeholder={t('Enter Passphrase')}
                  onChangeText={onChange}
                  isValid={isValidPassword(value)}
                  autoFocus={isWeb}
                  value={value}
                  error={
                    errors.password &&
                    (t('Please fill in at least 8 characters for passphrase.') as string)
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
                  placeholder={t('Repeat Passphrase')}
                  onChangeText={onChange}
                  value={value}
                  isValid={!!value && watch('password', '') === value}
                  secureTextEntry
                  error={errors.confirmPassword && (t("Passphrases don't match.") as string)}
                  autoCorrect={false}
                  onSubmitEditing={handleSubmit(createVault)}
                  containerStyle={spacings.mbSm}
                />
              )}
              name="confirmPassword"
            />
            {!isWeb &&
              hasBiometricsHardware &&
              deviceSecurityLevel === DEVICE_SECURITY_LEVEL.BIOMETRIC && (
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
