import { isEmail, isValidPassword } from 'ambire-common/src/services/validations'
import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import spacings from '@modules/common/styles/spacings'
import ExternalSignerAuthorization from '@modules/external-signers/components/ExternalSignerAuthorization'
import useExternalSigners from '@modules/external-signers/hooks/useExternalSigners'

const PrivateKeyForm = () => {
  const { t } = useTranslation()
  const { addExternalSigner } = useExternalSigners()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
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

  const handleFormSubmit = useCallback(() => {
    handleSubmit((props) => addExternalSigner(props, openBottomSheet))()
  }, [handleSubmit, addExternalSigner, openBottomSheet])

  const handleAuthorize = useCallback(
    ({ password, confirmPassword }) => {
      addExternalSigner({ password, confirmPassword, signer: watch('signer') })
    },
    [addExternalSigner, watch]
  )

  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Signer private key')}
            onChangeText={onChange}
            onSubmitEditing={handleFormSubmit}
            value={value}
            isValid={isEmail(value)}
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
          disabled={isSubmitting || !watch('signer', '')}
          type="outline"
          text={isSubmitting ? t('Logging in...') : t('Log In')}
          onPress={handleFormSubmit}
        />
      </View>
      {/* <BottomSheet id="authorize" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
        <ExternalSignerAuthorization hasRegisteredPassword onAuthorize={handleAuthorize} />
      </BottomSheet> */}
    </>
  )
}

export default PrivateKeyForm
