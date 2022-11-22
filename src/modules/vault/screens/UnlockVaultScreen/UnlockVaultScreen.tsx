import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import useVault from '@modules/vault/hooks/useVault'

const CreateVaultScreen = ({ navigation }: any) => {
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
          <AmbireLogo shouldExpand={false} />
          <View style={[spacings.mbLg, spacings.ph, flexboxStyles.flex1, flexboxStyles.justifyEnd]}>
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

export default CreateVaultScreen
