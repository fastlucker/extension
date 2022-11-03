import { isEmail } from 'ambire-common/src/services/validations'
import { Wallet } from 'ethers'
import React, { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { InteractionManager, Keyboard, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import ExternalSignerAuthorization from '@modules/external-signers/components/ExternalSignerAuthorization'
import useExternalSigners from '@modules/external-signers/hooks/useExternalSigners'

function sleep(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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
  const [memWallet, setMemWallet] = useState<any>(null)
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
    !isWeb && Keyboard.dismiss()

    handleSubmit(async ({ signer }) => {
      // wait state update before Wallet calcs
      await sleep(100)

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

          await addExternalSigner({ signer: wallet.privateKey }, openBottomSheet)
        } catch (e) {
          addToast(e.message || e, { error: true })
        }
      })
    })()
  }, [memWallet, handleSubmit, addExternalSigner, openBottomSheet, addToast])

  const handleAuthorize = useCallback(
    async ({ password, confirmPassword }) => {
      // wait state update before Wallet calcs
      await sleep(100)

      InteractionManager.runAfterInteractions(async () => {
        try {
          const mnemonic = formatMnemonic(watch('signer'))
          let wallet

          if (memWallet) {
            wallet = memWallet
          } else {
            wallet = Wallet.fromMnemonic(mnemonic)
          }

          if (!wallet) throw new Error('Invalid secret recovery phrase')
          setMemWallet(wallet)

          await addExternalSigner({ password, confirmPassword, signer: wallet.privateKey })
        } catch (e) {
          addToast(e.message || e, { error: true })
        }
      })
    },
    [memWallet, addExternalSigner, watch, addToast]
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
