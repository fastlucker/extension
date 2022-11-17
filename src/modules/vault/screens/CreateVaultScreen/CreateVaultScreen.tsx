import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import spacings from '@modules/common/styles/spacings'
import useVault from '@modules/vault/hooks/useVault'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

interface Props extends NativeStackScreenProps<any, 'createVault'> {}

const CreateVaultScreen = ({ navigation }: Props) => {
  const { t } = useTranslation()
  const { createPassword } = useVault()

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
    <>
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
            error={
              errors.password && (t('Please fill in at least 8 characters for password.') as string)
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
          text={isSubmitting ? t('Creating...') : t('Create')}
          onPress={handleSubmit(createPassword)}
        />
      </View>
    </>
  )
}

export default CreateVaultScreen
