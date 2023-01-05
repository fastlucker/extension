import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import { HEADER_HEIGHT } from '@config/Router/Header/style'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Text from '@modules/common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import KeyStoreLogo from '@modules/vault/components/KeyStoreLogo'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import useVault from '@modules/vault/hooks/useVault'

interface Props {
  onGoBack?: () => void
}

const ResetVaultScreen: React.FC<Props> = ({ onGoBack = () => {} }) => {
  const { t } = useTranslation()
  const { resetVault, vaultStatus } = useVault()

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

  return (
    <GradientBackgroundWrapper>
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
            contentContainerStyle={[spacings.pbLg]}
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
    </GradientBackgroundWrapper>
  )
}

export default ResetVaultScreen
