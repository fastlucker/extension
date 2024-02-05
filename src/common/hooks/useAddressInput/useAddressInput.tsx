import { useCallback, useEffect, useMemo } from 'react'

import { AddressState, AddressStateOptional } from '@ambire-common/interfaces/domains'
import { resolveENSDomain } from '@ambire-common/services/ensDomains'
import { resolveUDomain } from '@ambire-common/services/unstoppableDomains'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import useDebounce from '../useDebounce'
import useToast from '../useToast'
import getAddressInputValidation from './utils/validation'

interface Props {
  addressState: AddressState
  setAddressState: (newState: AddressStateOptional) => void
  overwriteError?: string
  overwriteValidLabel?: string
}

const useAddressInput = ({
  addressState,
  setAddressState,
  overwriteError,
  overwriteValidLabel
}: Props) => {
  const { networks } = useSettingsControllerState()
  const { addToast } = useToast()
  const debouncedAddress = useDebounce({
    value: addressState?.fieldValue || '',
    delay: 300
  })

  const validation = useMemo(
    () =>
      getAddressInputValidation({
        address: debouncedAddress,
        isRecipientDomainResolving: addressState?.isDomainResolving,
        isValidEns: !!addressState?.ensAddress,
        isValidUDomain: !!addressState?.udAddress,
        overwriteError,
        overwriteValidLabel
      }),
    [
      debouncedAddress,
      addressState?.isDomainResolving,
      addressState?.ensAddress,
      addressState?.udAddress,
      overwriteError,
      overwriteValidLabel
    ]
  )

  useEffect(() => {
    const trimmedAddress = debouncedAddress.trim()
    const domainRegex = /^[a-zA-Z0-9-]{1,63}(\.[a-zA-Z0-9-]{1,})$/
    const canBeEnsOrUd = domainRegex.test(trimmedAddress)

    if (!trimmedAddress || !canBeEnsOrUd) {
      setAddressState({
        ensAddress: '',
        udAddress: ''
      })
      return
    }

    setAddressState({
      isDomainResolving: true
    })

    Promise.all([
      resolveUDomain(trimmedAddress)
        .then((newUDAddress: string) => {
          setAddressState({
            udAddress: newUDAddress
          })
        })
        .catch(() => {
          setAddressState({
            udAddress: ''
          })
          addToast('Something went wrong while resolving Unstoppable domainsⓇ domain.', {
            type: 'error'
          })
        }),
      resolveENSDomain(trimmedAddress)
        .then((newEnsAddress: string) => {
          setAddressState({
            ensAddress: newEnsAddress
          })
        })
        .catch(() => {
          setAddressState({
            ensAddress: ''
          })
          addToast('Something went wrong while resolving Ethereum Name ServicesⓇ domain.', {
            type: 'error'
          })
        })
    ])
      .catch(() => {
        setAddressState({
          ensAddress: '',
          udAddress: ''
        })
        addToast('Something went wrong while resolving domain.', { type: 'error' })
      })
      .finally(() => {
        setAddressState({
          isDomainResolving: false
        })
      })
  }, [addToast, debouncedAddress, networks, setAddressState])

  const reset = useCallback(() => {
    setAddressState({
      fieldValue: '',
      ensAddress: '',
      udAddress: '',
      isDomainResolving: false
    })
  }, [setAddressState])

  const RHFValidate = useCallback(() => {
    // Disable the form if the address is not the same as the debounced address
    // This disables the submit button in the delay window
    if (addressState?.fieldValue !== debouncedAddress) return false
    // Disable the form if there is an error
    if (validation?.isError) return validation.message

    return true
  }, [addressState?.fieldValue, debouncedAddress, validation?.isError, validation.message])

  const setFieldValue = useCallback(
    (newValue: string) => {
      setAddressState({
        fieldValue: newValue
      })
    },
    [setAddressState]
  )

  return {
    debouncedAddress,
    validation,
    RHFValidate,
    resetAddressInput: reset,
    setFieldValue
  }
}

export default useAddressInput
