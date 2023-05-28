import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import Checkbox from '@common/components/Checkbox'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import InputPassword from '@common/components/InputPassword'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import { DEVICE_SECURITY_LEVEL } from '@common/contexts/biometricsContext/constants'
import useBiometrics from '@common/hooks/useBiometrics'
import useRoute from '@common/hooks/useRoute'
import { ROUTES } from '@common/modules/router/constants/common'
import useVault from '@common/modules/vault/hooks/useVault'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import styles from '@web/components/AuthLayoutWrapper/styles'
import KeyStoreIcon from '@common/assets/svg/KeyStoreIcon'

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
      nextRoute: route?.params?.nextRoute || ROUTES.getStarted
    }
  })

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={[styles.mainContentWrapper]}>
          <Text weight="medium" fontSize={20} style={{ ...spacings.mbLg, textAlign: 'center' }}>
            {t('Ambire Key Store')}
          </Text>
          <KeyStoreIcon style={{ ...flexboxStyles.alignSelfCenter, marginBottom: '64px' }} />
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
          <Checkbox label={t('Key store recovery by email')} />
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
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text weight="medium" style={spacings.mb} color={colors.titan} fontSize={20}>
          {t('Setup Your Ambire Key Store')}
        </Text>
        <Text weight="regular" style={spacings.mbTy} color={colors.titan} fontSize={16}>
          {t(
            'Ambire Keystore will protect your Ambire Wallet with a passphrase, encrypting all the keys that are stored locally with this passphrase through secure AES encryption.'
          )}
        </Text>
        <Text weight="regular" style={spacings.mbTy} color={colors.titan} fontSize={16}>
          {t(
            '1.  First, pick your passphrase. It should be long and you shouldnt reuse other passphrases.'
          )}
        </Text>
        <Text weight="regular" style={spacings.mbTy} color={colors.titan} fontSize={16}>
          {t(
            '2. You will use your passphrase to unlock the Ambire extension and sign transactions on this device.'
          )}
        </Text>
        <Text weight="regular" style={spacings.mbTy} color={colors.titan} fontSize={16}>
          {t('3. This passphrase can only be reset if you enable recovery via your email vault.')}
        </Text>
        <Text weight="regular" color={colors.radicalRed} fontSize={16}>
          {t(
            'If you disable email vault keystore recovery, and lose your passphrase, you will lose access to all keys and accounts on this device'
          )}
        </Text>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default CreateNewVaultScreen
