import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import Button from '@modules/common/components/Button'
import InputPassword from '@modules/common/components/InputPassword'
import NumberInput from '@modules/common/components/NumberInput'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import spacings from '@modules/common/styles/spacings'
import HardwareWalletSelectConnection from '@modules/hardware-wallet/components/HardwareWalletSelectConnection'
import {
  HardwareWalletBottomSheetType,
  QuickAccBottomSheetType
} from '@modules/sign-message/hooks/useSignMessage/useSignMessage'

import styles from './styles'

interface Props {
  isLoading: boolean
  approve: any
  approveQuickAcc: any
  resolve: any
  quickAccBottomSheet: QuickAccBottomSheetType
  hardwareWalletBottomSheet: HardwareWalletBottomSheetType
  confirmationType: string | null
}

const SignActions = ({
  isLoading,
  approve,
  approveQuickAcc,
  resolve,
  quickAccBottomSheet,
  hardwareWalletBottomSheet,
  confirmationType
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
        {!!account.signer?.quickAccManager && (
          <View style={spacings.mbTy}>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputPassword
                  placeholder={t('Account password')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="password"
            />
          </View>
        )}
        {!!errors.password && (
          <Text appearance="danger" style={spacings.mbSm}>
            {t('Password is required.')}
          </Text>
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
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
      <BottomSheet
        closeBottomSheet={quickAccBottomSheet.closeBottomSheet}
        isOpen={quickAccBottomSheet.isOpen}
        sheetRef={quickAccBottomSheet.sheetRef}
        dynamicInitialHeight={false}
      >
        <Title>{t('Confirmation code')}</Title>
        {(confirmationType === 'email' || !confirmationType) && (
          <Text style={spacings.mb}>
            {t('A confirmation code has been sent to your email, it is valid for 3 minutes.')}
          </Text>
        )}
        {confirmationType === 'otp' && (
          <Text style={spacings.mb}>{t('Please enter your OTP code.')}</Text>
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
          onPress={() => {
            handleSubmit(approveQuickAcc)()
            setValue('code', '')
            quickAccBottomSheet.closeBottomSheet()
          }}
        />
      </BottomSheet>
      <BottomSheet
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
