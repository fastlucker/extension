import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import { UseBottomSheetReturnType } from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import InputPassword from '@modules/common/components/InputPassword'
import NumberInput from '@modules/common/components/NumberInput'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import HardwareWalletSelectConnection from '@modules/hardware-wallet/components/HardwareWalletSelectConnection'

import styles from './styles'

export type QuickAccBottomSheetType = {
  sheetRef: any
  openBottomSheet: UseBottomSheetReturnType['openBottomSheet']
  closeBottomSheet: UseBottomSheetReturnType['closeBottomSheet']
  isOpen: boolean
}

export type HardwareWalletBottomSheetType = {
  sheetRef: any
  openBottomSheet: UseBottomSheetReturnType['openBottomSheet']
  closeBottomSheet: UseBottomSheetReturnType['closeBottomSheet']
  isOpen: boolean
}

interface Props {
  isLoading: boolean
  approve: any
  approveQuickAcc: any
  resolve: any
  quickAccBottomSheet: QuickAccBottomSheetType
  hardwareWalletBottomSheet: HardwareWalletBottomSheetType
  confirmationType: string | null
  isDeployed: boolean | null
  hasPrivileges: boolean | null
  hasProviderError: any
}

const SignActions = ({
  isLoading,
  approve,
  approveQuickAcc,
  resolve,
  quickAccBottomSheet,
  hardwareWalletBottomSheet,
  confirmationType,
  isDeployed,
  hasPrivileges,
  hasProviderError
}: Props) => {
  const { t } = useTranslation()
  const { account } = useAccounts()

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

  return (
    <>
      <View>
        {!!account.signer?.quickAccManager && !!isDeployed && (
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
              {t('You need to complete your first transaction to be able to sign messages.')}
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
              onPress={account.signer?.quickAccManager ? handleSubmit(approve) : approve}
              disabled={
                isLoading || (confirmationType === 'email' && !watch('password', '')) || !isDeployed
              }
            />
          </View>
        </View>
      </View>
      <BottomSheet
        id="sign"
        closeBottomSheet={quickAccBottomSheet.closeBottomSheet}
        isOpen={quickAccBottomSheet.isOpen}
        sheetRef={quickAccBottomSheet.sheetRef}
        dynamicInitialHeight={false}
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
        <NumberInput
          placeholder={
            confirmationType === 'otp' ? t('Authenticator OTP code') : t('Confirmation code')
          }
          onChangeText={(val) => setValue('code', val)}
          keyboardType="numeric"
          autoCorrect={false}
          value={watch('code', '')}
          autoFocus
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
        isOpen={hardwareWalletBottomSheet.isOpen}
        closeBottomSheet={hardwareWalletBottomSheet.closeBottomSheet}
        dynamicInitialHeight={false}
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
