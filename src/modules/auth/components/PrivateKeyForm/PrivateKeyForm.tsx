import { isEmail } from 'ambire-common/src/services/validations'
import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useExternalSigners from '@modules/common/hooks/useExternalSigners'
import spacings from '@modules/common/styles/spacings'

const PrivateKeyForm = () => {
  const { t } = useTranslation()
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

  const { addExternalSigner } = useExternalSigners()

  const handleFormSubmit = useCallback(() => {
    handleSubmit(addExternalSigner)()
  }, [])

  return (
    <>
      <Controller
        control={control}
        // TODO:
        // rules={{ validate: isEmail }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Private Key')}
            onChangeText={onChange}
            onSubmitEditing={handleFormSubmit}
            value={value}
            isValid={isEmail(value)}
            error={errors.signer && (t('Please fill in a valid private key.') as string)}
          />
        )}
        name="signer"
      />
      <View style={spacings.mbTy}>
        <Button
          disabled={isSubmitting || !watch('signer', '')}
          type="outline"
          text={isSubmitting ? t('Logging in...') : t('Log In')}
          onPress={handleFormSubmit}
        />
      </View>
      {/* {!!err && (
        <Text appearance="danger" style={spacings.mbSm}>
          {err}
        </Text>
      )} */}
      <Text style={spacings.mbSm} fontSize={12}>
        {t('A password will not be required, we will send a magic login link to your email.')}
      </Text>
    </>
  )
}

export default PrivateKeyForm
