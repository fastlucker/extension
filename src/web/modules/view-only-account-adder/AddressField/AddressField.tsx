import React, { FC, useCallback, useMemo } from 'react'
import { Controller, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form'
import { View } from 'react-native'

import { AddressStateOptional } from '@ambire-common/interfaces/domains'
import DeleteIcon from '@common/assets/svg/DeleteIcon'
import AddressInput from '@common/components/AddressInput'
import useAddressInput from '@common/hooks/useAddressInput'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getAddressFromAddressState } from '@common/utils/domains'
import useMainControllerState from '@web/hooks/useMainControllerState'

interface Props {
  duplicateAccountsIndexes: number[]
  field: any
  index: number
  watch: UseFormWatch<any>
  control: any
  isLoading: boolean
  handleSubmit: () => void
  remove: (index: number) => void
  disabled: boolean
  setValue: UseFormSetValue<any>
  trigger: UseFormTrigger<any>
}
const AddressField: FC<Props> = ({
  duplicateAccountsIndexes,
  field,
  index,
  watch,
  control,
  isLoading,
  handleSubmit,
  remove,
  disabled,
  setValue,
  trigger
}) => {
  const accounts = watch('accounts')
  const value = watch(`accounts.${index}`)
  const mainControllerState = useMainControllerState()

  const setAddressState = useCallback(
    (newState: AddressStateOptional) => {
      Object.keys(newState).forEach((key) => {
        // @ts-ignore
        setValue(`accounts.${index}.${key}`, newState[key], {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        })
      })
    },
    [index, setValue]
  )

  const overwriteError = useMemo(() => {
    if (
      mainControllerState.accounts.find(
        (account) => account.addr.toLowerCase() === getAddressFromAddressState(value).toLowerCase()
      )
    )
      return 'This address is already in your wallet.'

    if (duplicateAccountsIndexes.includes(index)) return 'Duplicate address.'

    return ''
  }, [duplicateAccountsIndexes, index, mainControllerState.accounts, value])

  const handleRevalidate = useCallback(() => {
    if (isLoading) return
    trigger(`accounts.${index}.fieldValue`)
  }, [index, isLoading, trigger])

  const { validation, RHFValidate } = useAddressInput({
    addressState: value,
    setAddressState,
    overwriteError,
    handleRevalidate
  })

  return (
    <Controller
      key={field.id}
      control={control}
      rules={{
        validate: RHFValidate,
        required: true
      }}
      render={({ field: { onChange, onBlur } }) => (
        <View style={[spacings.mbTy, flexbox.directionRow, flexbox.alignCenter]}>
          <AddressInput
            testID="view-only-address-field"
            validation={validation}
            containerStyle={{ ...spacings.mb0, ...flexbox.flex1 }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value.fieldValue}
            autoFocus
            disabled={isLoading}
            ensAddress={value.ensAddress}
            udAddress={value.udAddress}
            isRecipientDomainResolving={value.isDomainResolving}
            onSubmitEditing={disabled ? undefined : handleSubmit}
            button={accounts.length > 1 ? <DeleteIcon /> : null}
            onButtonPress={() => remove(index)}
          />
        </View>
      )}
      name={`accounts.${index}.fieldValue`}
    />
  )
}

export default AddressField
