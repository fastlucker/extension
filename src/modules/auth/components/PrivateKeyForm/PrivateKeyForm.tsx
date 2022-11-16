import { isEmail } from 'ambire-common/src/services/validations'
import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import spacings from '@modules/common/styles/spacings'
import ExternalSignerAuthorization from '@modules/external-signers/components/ExternalSignerAuthorization'
import useExternalSigners from '@modules/external-signers/hooks/useExternalSigners'

const PrivateKeyForm = () => {
  const { t } = useTranslation()
  const { addExternalSigner, hasRegisteredPassword } = useExternalSigners()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
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
        // TODO:
        // rules={{ validate:  }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Private Key')}
            onChangeText={onChange}
            onSubmitEditing={handleFormSubmit}
            value={value}
            isValid={isEmail(value)}
            error={errors.signer && (t('Please fill in a valid private key.') as string)}
            info={t('Enter signer private key.') as string}
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
      <BottomSheet id="authorize" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
        <ExternalSignerAuthorization
          hasRegisteredPassword={hasRegisteredPassword}
          onAuthorize={handleAuthorize}
        />
      </BottomSheet>
    </>
  )
}

export default PrivateKeyForm
