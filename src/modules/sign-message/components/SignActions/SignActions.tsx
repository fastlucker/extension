import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import InputPassword from '@modules/common/components/InputPassword'
import NumberInput from '@modules/common/components/NumberInput'
import P from '@modules/common/components/P'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import spacings from '@modules/common/styles/spacings'
import HardwareWalletConnect from '@modules/hardware-wallet/components/HardwareWalletConnect'
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
}

const SignActions = ({
  isLoading,
  approve,
  approveQuickAcc,
  resolve,
  quickAccBottomSheet,
  hardwareWalletBottomSheet
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
        {!!errors.password && <P type={TEXT_TYPES.DANGER}>{t('Password is required.')}</P>}
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              type={BUTTON_TYPES.DANGER}
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
        <Text style={spacings.mb}>
          {t(
            'A confirmation code has been sent to your email, it is valid for 3 minutes. Please enter it here:'
          )}
        </Text>
        <NumberInput
          placeholder={t('Confirmation code')}
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
        <HardwareWalletConnect
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
