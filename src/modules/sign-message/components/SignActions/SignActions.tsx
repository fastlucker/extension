import { signMessage, signMessage712 } from 'adex-protocol-eth/js/Bundle'
import { isValidPassword } from 'ambire-common/src/services/validations'
import { Wallet } from 'ethers'
import { arrayify, isHexString, toUtf8Bytes } from 'ethers/lib/utils'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import useBiometricsSign from '@modules/biometrics-sign/hooks/useBiometricsSign'
import BottomSheet from '@modules/common/components/BottomSheet'
import Button from '@modules/common/components/Button'
import InputConfirmationCode from '@modules/common/components/InputConfirmationCode'
import InputPassword from '@modules/common/components/InputPassword'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import ExternalSignerAuthorization from '@modules/external-signers/components/ExternalSignerAuthorization'
import useExternalSigners from '@modules/external-signers/hooks/useExternalSigners'
import HardwareWalletSelectConnection from '@modules/hardware-wallet/components/HardwareWalletSelectConnection'

import styles from './styles'

export type ExternalSignerBottomSheetType = {
  sheetRef: any
  openBottomSheet: (dest?: 'top' | 'default' | undefined) => void
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

export type QuickAccBottomSheetType = {
  sheetRef: any
  openBottomSheet: (dest?: 'top' | 'default' | undefined) => void
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

export type HardwareWalletBottomSheetType = {
  sheetRef: any
  openBottomSheet: (dest?: 'top' | 'default' | undefined) => void
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

interface Props {
  isLoading: boolean
  approve: any
  approveQuickAcc: any
  resolve: any
  toSign: any
  dataV4: any
  verifySignature: any
  externalSignerBottomSheet: ExternalSignerBottomSheetType
  quickAccBottomSheet: QuickAccBottomSheetType
  hardwareWalletBottomSheet: HardwareWalletBottomSheetType
  confirmationType: 'email' | 'otp' | null
  isDeployed: boolean | null
  hasPrivileges: boolean | null
  hasProviderError: any
}

function getMessageAsBytes(msg: string) {
  // Transforming human message / hex string to bytes
  if (!isHexString(msg)) {
    return toUtf8Bytes(msg)
  }
  return arrayify(msg)
}

const SignActions = ({
  isLoading,
  approve,
  approveQuickAcc,
  resolve,
  verifySignature,
  toSign,
  dataV4,
  externalSignerBottomSheet,
  quickAccBottomSheet,
  hardwareWalletBottomSheet,
  confirmationType,
  isDeployed,
  hasPrivileges,
  hasProviderError
}: Props) => {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const { network } = useNetwork()
  const { decryptExternalSigner, externalSigners } = useExternalSigners()
  const { selectedAccHasPassword, getSelectedAccPassword } = useBiometricsSign()
  const { addToast } = useToast()
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      password: '',
      code: ''
    }
  })

  // Not a common logic therefore implemented locally
  // Once implemented on web this should be moved in ambire-common
  const approveWithExternalSigner = async ({ password }: any) => {
    const privateKey: any = await decryptExternalSigner({
      signerPublicAddr: account.signer?.address,
      password
    })
    try {
      if (!privateKey) throw new Error('Invalid signer password - signer decryption failed')

      const wallet = new Wallet(privateKey)

      const sig = await (toSign.type === 'eth_signTypedData_v4' ||
      toSign.type === 'eth_signTypedData'
        ? signMessage712(
            wallet,
            account.id,
            account.signer,
            dataV4.domain,
            dataV4.types,
            dataV4.message
          )
        : signMessage(wallet, account.id, account.signer, getMessageAsBytes(toSign.txn)))

      await verifySignature(toSign, sig, network?.id)
      resolve({ success: true, result: sig })
      addToast('Successfully signed!')
    } catch (e) {
      addToast(`Signing error: ${e.message || e}`, {
        error: true
      })
    }
  }

  const handleSign = async () => {
    const externalSignerWithBiometricSign =
      externalSigners[account.signer?.address] && selectedAccHasPassword
    if (externalSignerWithBiometricSign) {
      const password = await getSelectedAccPassword()
      if (password) {
        approveWithExternalSigner({ password })
      }

      return
    }

    const externalSignerWithPassword = externalSigners[account.signer?.address]
    if (externalSignerWithPassword) {
      externalSignerBottomSheet.openBottomSheet()
      return
    }

    // Inject the password to the form, so that it is passed to the `onSubmit`
    // (`handleSubmit`) handler, which will then pass it to the `approve`
    // function. And therefore, the logic further down will be reused.
    const isQuickAccManagerWithBiometricsSign =
      account.signer?.quickAccManager && selectedAccHasPassword
    if (isQuickAccManagerWithBiometricsSign) {
      const password = await getSelectedAccPassword()
      if (password) {
        setValue('password', password)
      }
    }

    if (account.signer?.quickAccManager) {
      handleSubmit(approve)()
    } else {
      approve()
    }
  }

  return (
    <>
      <View>
        {!!account.signer?.quickAccManager && !!isDeployed && !selectedAccHasPassword && (
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputPassword
                placeholder={t('Account password')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                isValid={isValidPassword(value)}
                error={errors.password && (t('Please fill in a valid password.') as string)}
              />
            )}
            name="password"
          />
        )}
        {isDeployed === null && !hasProviderError && (
          <View style={[spacings.mbMd, flexboxStyles.alignCenter, flexboxStyles.justifyCenter]}>
            <Spinner />
          </View>
        )}
        {isDeployed === false && (
          <View style={[spacings.mbMd, spacings.phSm]}>
            <Text appearance="danger" fontSize={12}>
              {t("You can't sign this message yet.")}
            </Text>
            <Text appearance="danger" fontSize={12}>
              {t(
                `You need to complete your first transaction on ${network?.name} to be able to sign messages.`
              )}
            </Text>
          </View>
        )}
        {!hasPrivileges && (
          <View style={[spacings.mbMd, spacings.phSm]}>
            <Text appearance="danger" fontSize={12}>
              {t('You do not have the privileges to sign this message.')}
            </Text>
          </View>
        )}
        {!!hasProviderError && (
          <View style={[spacings.mbMd, spacings.phSm]}>
            <Text appearance="danger" fontSize={12}>
              {t('There was an issue with the network provider: {{error}}', {
                error: hasProviderError
              })}
            </Text>
          </View>
        )}
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              type="danger"
              text={t('Reject')}
              onPress={() => resolve({ message: t('signature denied') })}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              text={isLoading ? t('Signing...') : t('Sign')}
              onPress={handleSign}
              disabled={
                isLoading || (confirmationType === 'email' && !watch('password', '')) || !isDeployed
              }
            />
          </View>
        </View>
      </View>
      <BottomSheet
        id="authorize-external-signer"
        sheetRef={externalSignerBottomSheet.sheetRef}
        closeBottomSheet={externalSignerBottomSheet.closeBottomSheet}
      >
        <ExternalSignerAuthorization
          hasRegisteredPassword
          onAuthorize={(credentials) => {
            approveWithExternalSigner(credentials)
            externalSignerBottomSheet.closeBottomSheet()
          }}
        />
      </BottomSheet>
      <BottomSheet
        id="sign"
        closeBottomSheet={quickAccBottomSheet.closeBottomSheet}
        sheetRef={quickAccBottomSheet.sheetRef}
      >
        <Title style={textStyles.center}>{t('Confirmation code')}</Title>
        {(confirmationType === 'email' || !confirmationType) && (
          <Text style={spacings.mb}>
            {t('A confirmation code has been sent to your email, it is valid for 3 minutes.')}
          </Text>
        )}
        {confirmationType === 'otp' && (
          <Text style={spacings.mbTy}>{t('Please enter your OTP code.')}</Text>
        )}
        <InputConfirmationCode
          confirmationType={confirmationType}
          onChangeText={(val) => setValue('code', val)}
          value={watch('code', '')}
        />
        <Button
          text={t('Confirm')}
          disabled={!watch('code', '')}
          onPress={() => {
            handleSubmit(approveQuickAcc)()
            setValue('code', '')
            quickAccBottomSheet.closeBottomSheet()
          }}
        />
      </BottomSheet>
      <BottomSheet
        id="hardware-wallet-sign"
        sheetRef={hardwareWalletBottomSheet.sheetRef}
        closeBottomSheet={hardwareWalletBottomSheet.closeBottomSheet}
      >
        <HardwareWalletSelectConnection
          onSelectDevice={(device: any) => {
            approve({}, device)
            hardwareWalletBottomSheet.closeBottomSheet()
          }}
          shouldWrap={false}
        />
      </BottomSheet>
    </>
  )
}

export default SignActions
