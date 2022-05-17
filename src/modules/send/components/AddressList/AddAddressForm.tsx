import React, { useEffect } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import { useBottomSheetInternal } from '@gorhom/bottom-sheet'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import InputOrScan from '@modules/common/components/InputOrScan'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import { isValidAddress } from '@modules/common/services/address'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Props {
  onSubmit: (fieldValues: SubmitHandler<FieldValues>) => void
  address?: string
}

const AddAddressForm = ({ onSubmit, address }: Props) => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, dirtyFields, isSubmitSuccessful, isValid }
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      address
    }
  })

  const { shouldHandleKeyboardEvents } = useBottomSheetInternal()

  useEffect(() => {
    setValue('address', address)
  }, [address])

  useEffect(() => {
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful, reset])

  return (
    <>
      <View style={[spacings.mbSm, flexboxStyles.alignCenter]}>
        <Title>{t('Add New Address')}</Title>
      </View>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={() => {
              shouldHandleKeyboardEvents.value = false
              !!onBlur && onBlur()
            }}
            onFocus={() => {
              shouldHandleKeyboardEvents.value = true
            }}
            containerStyle={spacings.mbTy}
            placeholder={t('My Address')}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="name"
      />
      <Controller
        control={control}
        rules={{ validate: isValidAddress }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputOrScan
            onBlur={() => {
              shouldHandleKeyboardEvents.value = false
              !!onBlur && onBlur()
            }}
            onFocus={() => {
              shouldHandleKeyboardEvents.value = true
            }}
            containerStyle={spacings.mbTy}
            placeholder={t('0x')}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="address"
      />
      {!!errors.address && dirtyFields.address && (
        <Text appearance="danger" style={spacings.mbSm}>
          {t('Invalid address')}
        </Text>
      )}

      <Button
        onPress={handleSubmit(onSubmit)}
        type="outline"
        text={t('Add Address')}
        disabled={!isValid}
      />
    </>
  )
}

export default AddAddressForm
