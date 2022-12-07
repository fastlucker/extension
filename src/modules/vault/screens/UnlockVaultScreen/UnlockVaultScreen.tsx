import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import LockBackgroundIcon from '@assets/images/LockBackground.png'
import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import useVault from '@modules/vault/hooks/useVault'

import styles from './styles'

const UnlockVaultScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { unlockVault } = useVault()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      password: ''
    }
  })

  return (
    <GradientBackgroundWrapper>
      <View style={styles.backgroundImgWrapper}>
        <Image source={LockBackgroundIcon} style={styles.backgroundImg} resizeMode="contain" />
      </View>
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
                  autoFocus
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

            <View style={spacings.ptSm}>
              <Button
                disabled={isSubmitting || !watch('password', '')}
                text={isSubmitting ? t('Unlocking...') : t('Unlock')}
                onPress={handleSubmit(unlockVault)}
              />
            </View>
            <View style={[flexboxStyles.alignCenter, spacings.pvTy]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('resetVault', { resetPassword: true })}
                hitSlop={{ top: 10, bottom: 15 }}
              >
                <Text weight="medium" fontSize={12}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Wrapper>
      </TouchableWithoutFeedback>
    </GradientBackgroundWrapper>
  )
}

export default UnlockVaultScreen
