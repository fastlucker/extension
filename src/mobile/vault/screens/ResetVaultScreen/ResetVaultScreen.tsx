import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Input from '@common/components/Input'
import InputPassword from '@common/components/InputPassword'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@common/components/Wrapper'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import { HEADER_HEIGHT } from '@config/Router/Header/style'
import KeyStoreLogo from '@mobile/vault/components/KeyStoreLogo'
import { VAULT_STATUS } from '@mobile/vault/constants/vaultStatus'
import { VaultContextReturnType } from '@mobile/vault/contexts/vaultContext/types'

interface Props {
  hasGradientBackground?: boolean
  onGoBack?: () => void
  // Do not use `useVault` hook in this component because it is causing a
  // require cycle (this component is also used in the vaultContext).
  resetVault: VaultContextReturnType['resetVault']
  vaultStatus: VaultContextReturnType['vaultStatus']
}

const ResetVaultScreen: React.FC<Props> = ({
  hasGradientBackground = true,
  onGoBack = () => {},
  resetVault,
  vaultStatus
}) => {
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const BackgroundWrapper = hasGradientBackground ? GradientBackgroundWrapper : React.Fragment

  return (
    <BackgroundWrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          !isWeb && Keyboard.dismiss()
        }}
      >
        <>
          {/* When locked temporarily, the component is mounted as an absolute */}
          {/* positioned overlay, which has no title. So this custom header */}
          {/* serves two purposes: 1) allows the user to go back and */}
          {/* 2) compensates the missing title vertical gap and aligns better */}
          {vaultStatus === VAULT_STATUS.LOCKED_TEMPORARILY && (
            <View style={[{ height: HEADER_HEIGHT }, spacings.ml]}>
              <NavIconWrapper onPress={onGoBack}>
                <LeftArrowIcon withRect />
              </NavIconWrapper>
            </View>
          )}
          <Wrapper
            contentContainerStyle={spacings.pbLg}
            type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW}
            extraHeight={220}
          >
            <KeyStoreLogo />
            <View style={[isWeb && spacings.ph, flexboxStyles.flex1, flexboxStyles.justifyEnd]}>
              <View style={spacings.phTy}>
                <Text weight="regular" style={spacings.mbMi} fontSize={13}>
                  {t(
                    'Ambire does not keep a copy of your Key Store passphrase. If you’re having trouble unlocking your {{name}}, you will need to create a new Key Store passphrase.',
                    { name: isWeb ? t('extension') : t('app') }
                  )}
                </Text>
                <Text weight="regular" style={spacings.mbTy} fontSize={13}>
                  {t('This action will remove all your accounts from this device!')}
                </Text>
              </View>
              <Controller
                control={control}
                rules={{ validate: isValidPassword }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputPassword
                    onBlur={onBlur}
                    placeholder={t('New passphrase')}
                    onChangeText={onChange}
                    isValid={isValidPassword(value)}
                    value={value}
                    error={
                      errors.password &&
                      (t('Please fill in at least 8 characters for passphrase.') as string)
                    }
                    containerStyle={spacings.mbTy}
                    onSubmitEditing={handleSubmit(resetVault)}
                    autoFocus={isWeb}
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
                    placeholder={t('Repeat passphrase')}
                    onChangeText={onChange}
                    value={value}
                    isValid={!!value && watch('password', '') === value}
                    secureTextEntry
                    error={errors.confirmPassword && (t("Passphrases don't match.") as string)}
                    autoCorrect={false}
                    containerStyle={spacings.mbTy}
                    onSubmitEditing={handleSubmit(resetVault)}
                  />
                )}
                name="confirmPassword"
              />

              <View style={spacings.ptSm}>
                <Button
                  disabled={isSubmitting || !watch('password', '') || !watch('confirmPassword', '')}
                  text={
                    // eslint-disable-next-line no-nested-ternary
                    isSubmitting ? t('Resetting...') : t('Reset Ambire Key Store')
                  }
                  onPress={handleSubmit(resetVault)}
                />
              </View>
            </View>
          </Wrapper>
        </>
      </TouchableWithoutFeedback>
    </BackgroundWrapper>
  )
}

export default React.memo(ResetVaultScreen)
