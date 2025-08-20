import React, { FC, useCallback, useMemo } from 'react'
import { Controller, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AddressStateOptional } from '@ambire-common/interfaces/domains'
import { getAddressFromAddressState } from '@ambire-common/utils/domains'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import DeleteIcon from '@common/assets/svg/DeleteIcon'
import AddressInput from '@common/components/AddressInput'
import Banner from '@common/components/Banner/Banner'
import useAddressInput from '@common/hooks/useAddressInput'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

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
  const { dispatch } = useBackgroundService()
  const accountsState = useAccountsControllerState()
  const accounts = watch('accounts')
  const value = watch(`accounts.${index}`)
  const { t } = useTranslation()

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

  // Check if an address is already associated with existing accounts
  // If that is the case the address will be added with the associated keys
  // and not as a view-only account,
  // so we need to inform the user about this to make the behavior clear
  const addressesInAssociatedKeys = useMemo(() => {
    const fieldVal = value?.fieldValue.toLowerCase()
    if (!fieldVal) return []
    if (accountsState.accounts.find((account) => account.addr.toLowerCase() === fieldVal)) return []
    return accountsState.accounts
      .filter((account) =>
        (account.associatedKeys || []).some((key) => key?.toLowerCase() === fieldVal)
      )
      .map((account) => account.addr)
  }, [accountsState.accounts, value, value?.fieldValue])

  const overwriteError = useMemo(() => {
    // We don't want to update the error message while accounts are being
    // imported because that would stop the import process.
    if (isLoading) return ''

    if (
      accountsState.accounts.find(
        (account) => account.addr.toLowerCase() === getAddressFromAddressState(value).toLowerCase()
      )
    )
      return 'This address is already in your wallet.'

    if (duplicateAccountsIndexes.includes(index)) return 'Duplicate address.'

    return ''
  }, [duplicateAccountsIndexes, index, isLoading, accountsState.accounts, value])

  const handleRevalidate = useCallback(() => {
    // We don't want to update the error message while accounts are being
    // imported because that would stop the import process.
    if (isLoading) return
    trigger(`accounts.${index}.fieldValue`)
  }, [index, isLoading, trigger])

  const handleCacheResolvedDomain = useCallback(
    (address: string, domain: string, type: 'ens') => {
      dispatch({
        type: 'DOMAINS_CONTROLLER_SAVE_RESOLVED_REVERSE_LOOKUP',
        params: {
          type,
          address,
          name: domain
        }
      })
    },
    [dispatch]
  )

  const { validation, RHFValidate } = useAddressInput({
    addressState: value,
    setAddressState,
    overwriteError,
    handleRevalidate,
    handleCacheResolvedDomain
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
        <View>
          <View style={[spacings.mbTy, flexbox.directionRow, flexbox.alignCenter]}>
            <AddressInput
              testID={`view-only-address-field-${index}`}
              validation={validation}
              containerStyle={{ ...spacings.mb0, ...flexbox.flex1 }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value.fieldValue}
              autoFocus
              disabled={isLoading}
              ensAddress={value.ensAddress}
              isRecipientDomainResolving={value.isDomainResolving}
              onSubmitEditing={disabled ? undefined : handleSubmit}
              button={accounts.length > 1 ? <DeleteIcon /> : null}
              onButtonPress={() => remove(index)}
            />
          </View>
          {addressesInAssociatedKeys?.length > 0 &&
            addressesInAssociatedKeys.map((_address) => {
              return (
                <Banner
                  title={t('This account’s key is already imported.')}
                  text={t(
                    `It’s the same key associated with ${shortenAddress(
                      _address,
                      13
                    )}. If you continue, this address will be linked to that key and managed with full access, not as view-only.`
                  )}
                  type="info2"
                  key={_address}
                />
              )
            })}
        </View>
      )}
      name={`accounts.${index}.fieldValue`}
    />
  )
}

export default AddressField
