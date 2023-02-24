import { isValidPassword } from 'ambire-common/src/services/validations'
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import { HEADER_HEIGHT } from '@config/Router/Header/style'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useDisableNavigatingBack from '@modules/common/hooks/useDisableNavigatingBack'
import { navigate } from '@modules/common/services/navigation'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import KeyStoreLogo from '@modules/vault/components/KeyStoreLogo'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import { VaultContextReturnType } from '@modules/vault/contexts/vaultContext/types'

const FOOTER_BUTTON_HIT_SLOP = { top: 10, bottom: 15 }

interface Props {
  hasGradientBackground?: boolean
  onForgotPassword?: () => void
  // Do not use `useVault` hook in this component because it is causing a
  // require cycle (this component is also used in the vaultContext).
  unlockVault: VaultContextReturnType['unlockVault']
  vaultStatus: VaultContextReturnType['vaultStatus']
  biometricsEnabled: VaultContextReturnType['biometricsEnabled']
}

const UnlockVaultScreen: React.FC<Props> = ({
  onForgotPassword = () => {},
  unlockVault,
  vaultStatus,
  biometricsEnabled,
  hasGradientBackground = true
}) => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      password: ''
    }
  })

  useEffect(() => {
    if (!biometricsEnabled) {
      return
    }

    // Trigger only when the vault is locked, which is the case when the app
    // gets opened for the first time. Otherwise, when the vault gets
    // temporary locked (when app goes inactive), this trigger is
    // getting fired immediately when the app goes inactive,
    // not when the app comes back in active state. Which messes up
    // the biometrics prompt (it freezes and the promise never resolves).
    if (vaultStatus === VAULT_STATUS.LOCKED) {
      handleSubmit(unlockVault)()
    }
  }, [biometricsEnabled, handleSubmit, unlockVault, vaultStatus])

  const handleRetryBiometrics = useCallback(() => {
    setValue('password', '')
    return handleSubmit(unlockVault)()
  }, [handleSubmit, unlockVault, setValue])

  const handleForgotPassword = useCallback(() => {
    // Navigate only if vault is locked, which means that the VaultStack
    // is mounted and the reset vault screen route exists.
    // Otherwise, the user is in another navigation stack (or in temporarily
    // locked state), so the reset vault screen route doesn't exist.
    if (vaultStatus === VAULT_STATUS.LOCKED) {
      navigate('resetVault', { resetPassword: true })
    }

    onForgotPassword()
  }, [vaultStatus, onForgotPassword])

  useDisableNavigatingBack()

  const BackgroundWrapper = hasGradientBackground ? GradientBackgroundWrapper : React.Fragment

  return (
    <BackgroundWrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          !isWeb && Keyboard.dismiss()
        }}
      >
        <Wrapper
          contentContainerStyle={[
            spacings.pbLg,
            // When locked temporarily, the component is mounted as an absolute
            // positioned overlay, which has no title. So the top margin
            // compensates the missing title and aligns the KeyStoreLogo better.
            vaultStatus === VAULT_STATUS.LOCKED_TEMPORARILY && { marginTop: HEADER_HEIGHT }
          ]}
          type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW}
          extraHeight={220}
        >
          <KeyStoreLogo />

          <View style={[isWeb && spacings.ph, flexboxStyles.flex1, flexboxStyles.justifyEnd]}>
            <Text weight="regular" style={[spacings.mbTy, spacings.phTy]} fontSize={13}>
              {t('Enter your Ambire Key Store passphrase to unlock your wallet')}
            </Text>

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputPassword
                  onBlur={onBlur}
                  placeholder={t('Passphrase')}
                  autoFocus={isWeb}
                  onChangeText={onChange}
                  isValid={isValidPassword(value)}
                  value={value}
                  onSubmitEditing={handleSubmit(unlockVault)}
                  error={
                    errors.password &&
                    (t('Please fill in at least 8 characters for passphrase.') as string)
                  }
                  containerStyle={spacings.mbTy}
                />
              )}
              name="password"
            />

            <View style={spacings.ptSm}>
              <Button
                disabled={isSubmitting || !watch('password', '')}
                text={isSubmitting ? t('Unlocking...') : t('Unlock')}
                onPress={handleSubmit(unlockVault)}
              />
            </View>
            <View style={[flexboxStyles.justifyCenter, flexboxStyles.directionRow, spacings.pvTy]}>
              <TouchableOpacity onPress={handleForgotPassword} hitSlop={FOOTER_BUTTON_HIT_SLOP}>
                <Text weight="medium" fontSize={12}>
                  {t('Forgot Key Store passphrase?')}
                </Text>
              </TouchableOpacity>
              {biometricsEnabled && (
                <>
                  <Text weight="medium" fontSize={12}>
                    {' | '}
                  </Text>
                  <TouchableOpacity
                    onPress={handleRetryBiometrics}
                    hitSlop={FOOTER_BUTTON_HIT_SLOP}
                  >
                    <Text weight="medium" fontSize={12}>
                      {t('Retry biometrics')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Wrapper>
      </TouchableWithoutFeedback>
    </BackgroundWrapper>
  )
}

export default React.memo(UnlockVaultScreen)
