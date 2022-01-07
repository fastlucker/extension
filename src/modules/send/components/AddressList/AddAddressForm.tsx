import React from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import P from '@modules/common/components/P'
import Title from '@modules/common/components/Title'
import { isValidAddress } from '@modules/common/services/address'

import styles from './styles'

interface Props {
  onSubmit: (fieldValues: SubmitHandler<FieldValues>) => void
}

const AddAddressForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isSubmitSuccessful, isValid }
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      address: ''
    }
  })

  React.useEffect(() => {
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful, reset])

  return (
    <View>
      <View style={styles.formTitleWrapper}>
        <Title>{t('Add New Address')}</Title>
      </View>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
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
          <Input onBlur={onBlur} placeholder={t('0x')} onChangeText={onChange} value={value} />
        )}
        name="address"
      />
      {!!errors.address && dirtyFields.address && <P>Invalid address</P>}

      <Button onPress={handleSubmit(onSubmit)} text={t('➕ Add Address')} disabled={isValid} />
    </View>
  )
}

export default AddAddressForm
