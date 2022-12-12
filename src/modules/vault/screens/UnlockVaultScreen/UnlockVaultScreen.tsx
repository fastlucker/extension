import { isValidPassword } from 'ambire-common/src/services/validations'
import React, { useCallback, useEffect, useState } from 'react'
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
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import LockBackground from '@modules/vault/components/LockBackground'
import useVault from '@modules/vault/hooks/useVault'

const FOOTER_BUTTON_HIT_SLOP = { top: 10, bottom: 15 }

const UnlockVaultScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { unlockVault } = useVault()
  const { biometricsEnabled, getVaultPassword } = useBiometricsSign()
  const [isAttemptingToUnlockWithBiometrics, setIsAttemptingToUnlockWithBiometrics] =
    useState(biometricsEnabled)
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting: isFormSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      password: ''
    }
  })

  // The `isSubmitting` flag on the form does not flip when the biometrics
  // unlocking is in progress, so we need to manually check for that.
  const isSubmitting = isFormSubmitting || isAttemptingToUnlockWithBiometrics

  const tryUnlockingWithBiometrics = useCallback(async () => {
    setIsAttemptingToUnlockWithBiometrics(true)

    try {
      const password = await getVaultPassword()
      if (password) {
        setValue('password', password)
        handleSubmit(unlockVault)()
      } else {
        setIsAttemptingToUnlockWithBiometrics(false)
      }
    } catch {
      // Fail silently. The use can enter his password manually.
      setIsAttemptingToUnlockWithBiometrics(false)
    }
  }, [getVaultPassword, handleSubmit, setValue, unlockVault])

  useEffect(() => {
    if (!biometricsEnabled) {
      return
    }

    tryUnlockingWithBiometrics()
  }, [biometricsEnabled, tryUnlockingWithBiometrics])

  const handleForgotPassword = useCallback(
    () => navigation.navigate('resetVault', { resetPassword: true }),
    [navigation]
  )

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
              rules={{ validate: isValidPassword }}
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
                    onPress={tryUnlockingWithBiometrics}
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
