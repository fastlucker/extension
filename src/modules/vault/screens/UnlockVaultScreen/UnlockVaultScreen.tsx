import { isValidPassword } from 'ambire-common/src/services/validations'
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import useBiometricsSign from '@modules/biometrics-sign/hooks/useBiometricsSign'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useDisableHardwareBackPress from '@modules/common/hooks/useDisableHardwareBackPress'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import LockBackground from '@modules/vault/components/LockBackground'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import useVault from '@modules/vault/hooks/useVault'

const FOOTER_BUTTON_HIT_SLOP = { top: 10, bottom: 15 }

const UnlockVaultScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { unlockVault, vaultStatus } = useVault()
  const { biometricsEnabled } = useBiometricsSign()
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

  const handleForgotPassword = useCallback(
    () => navigation.navigate('resetVault', { resetPassword: true }),
    [navigation]
  )

  // Prevent going back, needed for the temporary locked keystore case,
  // where the user must unlock before he comes back to the previous screen.
  // {@link https://reactnavigation.org/docs/preventing-going-back/}
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (vaultStatus !== VAULT_STATUS.UNLOCKED) {
        // Prevent default behavior of leaving the screen
        e.preventDefault()
      }
    })

    return unsubscribe
  }, [navigation, vaultStatus])

  useDisableHardwareBackPress()

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
            <View style={spacings.phTy}>
              <Text weight="regular" style={spacings.mbTy} color={colors.titan_50}>
                {t('Enter your Ambire Key Store Lock to unlock your wallet')}
              </Text>
            </View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputPassword
                  onBlur={onBlur}
                  placeholder={t('Password')}
                  onChangeText={onChange}
                  isValid={isValidPassword(value)}
                  value={value}
                  onSubmitEditing={handleSubmit(unlockVault)}
                  error={
                    errors.password &&
                    (t('Please fill in at least 8 characters for password.') as string)
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
                  {t('Forgot password?')}
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
    </GradientBackgroundWrapper>
  )
}

export default UnlockVaultScreen
