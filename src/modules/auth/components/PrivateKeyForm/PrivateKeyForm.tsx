import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import useExternalSignerLogin from '@modules/auth/hooks/useExternalSignerLogin'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'

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
      signer: ''
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
          />
        )}
        name="signer"
      />
      <Button
        disabled={isSubmitting || !watch('signer', '')}
        type="outline"
        text={isSubmitting ? t('Logging in...') : t('Log In')}
        onPress={handleSubmit(addExternalSigner)}
      />
    </>
  )
}

export default PrivateKeyForm
