import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import LockBackgroundIcon from '@assets/images/LockBackground.png'
import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import useVault from '@modules/vault/hooks/useVault'

import styles from './styles'

const ResetVaultScreen = () => {
  const { t } = useTranslation()
  const { resetVault } = useVault()

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
      <Image source={LockBackgroundIcon} style={styles.backgroundImg} />
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
              spacings.ph,
              flexboxStyles.flex1,
              flexboxStyles.justifyEnd
            ]}
          >
            <Text weight="regular" style={spacings.mbMi} color={colors.titan_50}>
              {t(
                'Ambire does not keep a copy of your lock password. If you’re having trouble unlocking your extension, you will need to create a new password.'
              )}
            </Text>
            <Text weight="regular" style={spacings.mbTy} color={colors.titan_50}>
              {t('This action will remove all your accounts from this device!')}
            </Text>

            <Controller
              control={control}
              rules={{ validate: isValidPassword }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputPassword
                  onBlur={onBlur}
                  placeholder={t('New password')}
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
                  isSubmitting ? t('Creating...') : t('Create New Password')
                }
                onPress={handleSubmit(resetVault)}
              />
            </View>
          </View>
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default ResetVaultScreen
