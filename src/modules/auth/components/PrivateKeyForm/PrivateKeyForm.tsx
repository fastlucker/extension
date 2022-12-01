import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import useExternalSignerLogin from '@modules/auth/hooks/useExternalSignerLogin'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import spacings from '@modules/common/styles/spacings'

const PrivateKeyForm = () => {
  const { t } = useTranslation()
  const { addExternalSigner } = useExternalSignerLogin()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      signer: '',
      password: ''
    }
  })

  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Signer private key')}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(addExternalSigner)}
            value={value}
            autoFocus={isWeb}
            error={errors.signer && (t('Please fill in a valid private key.') as string)}
            containerStyle={spacings.mbTy}
          />
        )}
        name="signer"
      />
      <Controller
        control={control}
        rules={{ validate: isValidPassword }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputPassword
            onBlur={onBlur}
            placeholder={t('Extension lock password')}
            onChangeText={onChange}
            isValid={isValidPassword(value)}
            value={value}
            error={
              errors.password && (t('Please fill in at least 8 characters for password.') as string)
            }
          />
        )}
        name="password"
      />
      <View style={spacings.mbTy}>
        <Button
          disabled={isSubmitting || !watch('signer', '') || !watch('password', '')}
          type="outline"
          text={isSubmitting ? t('Logging in...') : t('Log In')}
          onPress={handleSubmit(addExternalSigner)}
        />
      </View>
    </>
  )
}

export default PrivateKeyForm
