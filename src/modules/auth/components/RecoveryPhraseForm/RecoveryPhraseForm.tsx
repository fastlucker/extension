import { isEmail } from 'ambire-common/src/services/validations'
import { Wallet } from 'ethers'
import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import ExternalSignerAuthorization from '@modules/external-signers/components/ExternalSignerAuthorization'
import useExternalSigners from '@modules/external-signers/hooks/useExternalSigners'

const formatMnemonic = (mnemonic: string) =>
  mnemonic
    .replace(/\s{2,}/g, ' ')
    .replace(/;/g, '')
    .replace(/,/g, '')

const RecoveryPhraseForm = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
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
    handleSubmit(({ signer }) => {
      try {
        const mnemonic = formatMnemonic(signer)
        const wallet = Wallet.fromMnemonic(mnemonic)

        if (!wallet) throw new Error('Invalid secret recovery phrase')

        addExternalSigner({ signer: wallet.privateKey }, openBottomSheet)
      } catch (e) {
        addToast(e.message || e, { error: true })
      }
    })()
  }, [handleSubmit, addExternalSigner, openBottomSheet, addToast])

  const handleAuthorize = useCallback(
    ({ password, confirmPassword }) => {
      try {
        const mnemonic = formatMnemonic(watch('signer'))
        const wallet = Wallet.fromMnemonic(mnemonic)

        if (!wallet) throw new Error('Invalid secret recovery phrase')
        addExternalSigner({ password, confirmPassword, signer: wallet.privateKey })
      } catch (e) {
        addToast(e.message || e, { error: true })
      }
    },
    [addExternalSigner, watch, addToast]
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
            placeholder={t('Recovery phrase')}
            onChangeText={onChange}
            onSubmitEditing={handleFormSubmit}
            value={value}
            isValid={isEmail(value)}
            error={errors.signer && (t('Please fill in a valid recovery phrase.') as string)}
            info={t('Enter secret recovery/mnemonic phrase.') as string}
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

export default RecoveryPhraseForm
