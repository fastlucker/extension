import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import KeyStoreIcon from '@common/assets/svg/KeyStoreIcon'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Input from '@common/components/Input'
import InputPassword from '@common/components/InputPassword'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import { DEVICE_SECURITY_LEVEL } from '@common/contexts/biometricsContext/constants'
import useBiometrics from '@common/hooks/useBiometrics'
import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { ROUTES } from '@common/modules/router/constants/common'
import { isValidPassword } from '@common/services/validations/validate'
import colors from '@common/styles/colors'
import spacings, { SPACING_LG, SPACING_SM } from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import styles from '@web/components/AuthLayoutWrapper/styles'

const CreateNewKeyStoreScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
  const [enableEmailRecovery, onEnableEmailRecoveryChange] = useState(false)
  const { stepperState, updateStepperState } = useStepper()

  const setNextStepperState = () => {
    updateStepperState(stepperState.currentStep + 1, stepperState.currentFlow)
  }

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
        !isWeb && hasBiometricsHardware && deviceSecurityLevel === DEVICE_SECURITY_LEVEL.BIOMETRIC
    }
  })

  useEffect(() => {
    let timer
    const delay = 4
    if (isSubmitSuccessful) {
      setTimeout(() => {
        setNextStepperState()
        navigate(ROUTES.accountsPersonalize)
      }, delay * 1000)
    }

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    return () => {
      clearTimeout(timer)
    }
  }, [isSubmitSuccessful])

  return (
    <>
      <AuthLayoutWrapperMainContent hideStepper={isSubmitSuccessful}>
        <View
          style={[styles.mainContentWrapper, isSubmitSuccessful && flexboxStyles.justifyCenter]}
        >
          {!isSubmitSuccessful && (
            <Text weight="medium" fontSize={16} style={{ ...spacings.mbLg, textAlign: 'center' }}>
              {t('Ambire Key Store')}
            </Text>
          )}
          <KeyStoreIcon
            style={{ ...flexboxStyles.alignSelfCenter, marginBottom: SPACING_LG * 2 }}
          />
          {isSubmitSuccessful && (
            <Text
              color={colors.martinique}
              style={{ textAlign: 'center' }}
              weight="medium"
              fontSize={16}
            >
              {t('Your Ambire Key Store\nis ready!')}
            </Text>
          )}
          {!isSubmitSuccessful && (
            <>
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
                    containerStyle={spacings.mbSm}
                  />
                )}
                name="confirmPassword"
              />
              <Checkbox
                value={enableEmailRecovery}
                onValueChange={() => onEnableEmailRecoveryChange((prev) => !prev)}
                label={t('Key store recovery by email')}
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
                textStyle={{ fontSize: 14 }}
                disabled={isSubmitting || !watch('password', '') || !watch('confirmPassword', '')}
                text={isSubmitting ? t('Setting up...') : t('Setup Ambire Key Store')}
                onPress={() => {
                  setIsSubmitSuccessful(true)
                }}
              />
            </>
          )}
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text weight="medium" style={spacings.mb} color={colors.titan} fontSize={16}>
          {t('Setup Your Ambire Key Store')}
        </Text>
        <Text
          shouldScale={false}
          weight="regular"
          style={spacings.mb}
          color={colors.titan}
          fontSize={14}
        >
          {t(
            'Ambire Keystore will protect your Ambire Wallet with a passphrase, encrypting all the keys that are stored locally with this passphrase through secure AES encryption.'
          )}
        </Text>
        <ol style={{ fontSize: 14, color: colors.white, margin: 0, paddingLeft: SPACING_SM }}>
          <li style={spacings.mb}>
            <Text shouldScale={false} weight="regular" color={colors.titan} fontSize={14}>
              {t(
                'First, pick your passphrase. It should be long and you shouldnt reuse other passphrases.'
              )}
            </Text>
          </li>
          <li style={spacings.mb}>
            <Text shouldScale={false} weight="regular" color={colors.titan} fontSize={14}>
              {t(
                'You will use your passphrase to unlock the Ambire extension and sign transactions on this device.'
              )}
            </Text>
          </li>
          <li style={spacings.mb}>
            <Text
              shouldScale={false}
              weight="regular"
              style={spacings.mb}
              color={colors.titan}
              fontSize={14}
            >
              {t('This passphrase can only be reset if you enable recovery via your email vault.')}
            </Text>
          </li>
        </ol>
        <Text shouldScale={false} weight="regular" color={colors.radicalRed} fontSize={14}>
          {t(
            'If you disable email vault keystore recovery, and lose your passphrase, you will lose access to all keys and accounts on this device'
          )}
        </Text>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default CreateNewKeyStoreScreen
