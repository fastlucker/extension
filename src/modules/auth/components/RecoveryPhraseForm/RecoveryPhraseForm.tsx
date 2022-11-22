import { isValidPassword } from 'ambire-common/src/services/validations'
import { Wallet } from 'ethers'
import React, { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { InteractionManager, Keyboard, View } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import useExternalSignerLogin from '@modules/auth/hooks/useExternalSignerLogin'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import { delayPromise } from '@modules/common/utils/promises'

const formatMnemonic = (mnemonic: string) =>
  mnemonic
    .replace(/;/g, ' ')
    .replace(/,/g, ' ')
    .replace(/\s{2,}/g, ' ')

const RecoveryPhraseForm = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { addExternalSigner } = useExternalSignerLogin()
  const [memWallet, setMemWallet] = useState<any>(null)
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
    !isWeb && Keyboard.dismiss()

    handleSubmit(async ({ signer, password }) => {
      // wait state update before Wallet calcs because
      // when Wallet method is called on devices with slow CPU the UI freezes
      await delayPromise(100)

      InteractionManager.runAfterInteractions(async () => {
        try {
          const mnemonic = formatMnemonic(signer)
          let wallet

          if (memWallet) {
            wallet = memWallet
          } else {
            wallet = Wallet.fromMnemonic(mnemonic)
          }

          if (!wallet) throw new Error('Invalid secret recovery phrase')
          setMemWallet(wallet)

          await addExternalSigner({ signer: wallet.privateKey, password })
        } catch (e) {
          addToast(e.message || e, { error: true })
        }
      })
    })()
  }, [memWallet, handleSubmit, addExternalSigner, addToast])

  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Recovery phrase')}
            onChangeText={(props) => {
              if (memWallet) {
                setMemWallet(null)
              }
              onChange(props)
            }}
            onSubmitEditing={handleFormSubmit}
            value={value}
            error={errors.signer && (t('Please fill in a valid recovery phrase.') as string)}
            info={
              t(
                'Enter secret recovery/mnemonic phrase. Each word should be separated by space or comma.'
              ) as string
            }
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
          onPress={handleFormSubmit}
        />
      </View>
    </>
  )
}

export default RecoveryPhraseForm
