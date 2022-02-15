import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import NumberInput from '@modules/common/components/NumberInput'
import P from '@modules/common/components/P'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import spacings from '@modules/common/styles/spacings'

import styles from './styles'

const SignActions = ({
  isLoading,
  approve,
  approveQuickAcc,
  resolve,
  sheetRef,
  closeBottomSheet,
  isBottomSheetOpen
}: any) => {
  const { t } = useTranslation()
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
        <View style={spacings.mbTy}>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t('Account password')}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
                autoCorrect={false}
                value={value}
              />
            )}
            name="password"
          />
        </View>
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
              onPress={handleSubmit(approve)}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
      <BottomSheet
        closeBottomSheet={isBottomSheetOpen}
        isOpen={isBottomSheetOpen}
        sheetRef={sheetRef}
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
        />
        <Button
          text={t('Confirm')}
          onPress={() => {
            handleSubmit(approveQuickAcc)()
            setValue('code', '')
            closeBottomSheet()
          }}
        />
      </BottomSheet>
    </>
  )
}

export default SignActions
