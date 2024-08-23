import { useCallback, useEffect, useMemo, useRef } from 'react'

import { AddressState, AddressStateOptional } from '@ambire-common/interfaces/domains'
import { resolveENSDomain } from '@ambire-common/services/ensDomains'
import { resolveUDomain } from '@ambire-common/services/unstoppableDomains'
import useBackgroundService from '@web/hooks/useBackgroundService'

import useDebounce from '../useDebounce'
import useToast from '../useToast'
import getAddressInputValidation from './utils/validation'

interface Props {
  addressState: AddressState
  setAddressState: (newState: AddressStateOptional) => void
  overwriteError?: string
  overwriteValidLabel?: string
  // handleRevalidate is required when the address input is used
  // together with react-hook-form. It is used to trigger the revalidation of the input.
  // !!! Must be memoized with useCallback
  handleRevalidate?: () => void
}

const useAddressInput = ({
  addressState,
  setAddressState,
  overwriteError,
  overwriteValidLabel,
  handleRevalidate
}: Props) => {
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const fieldValueRef = useRef(addressState.fieldValue)
  const fieldValue = addressState.fieldValue
  const debouncedFieldValue = useDebounce({
    value: fieldValue,
    delay: 300
  })

  const validation = useMemo(
    () =>
      getAddressInputValidation({
        debouncedAddress: debouncedFieldValue,
        address: addressState.fieldValue,
        isRecipientDomainResolving: addressState.isDomainResolving,
        isValidEns: !!addressState.ensAddress,
        isValidUDomain: !!addressState.udAddress,
        overwriteError,
        overwriteValidLabel
      }),
    [
      debouncedFieldValue,
      addressState.fieldValue,
      addressState.isDomainResolving,
      addressState.ensAddress,
      addressState.udAddress,
      overwriteError,
      overwriteValidLabel
    ]
  )

  const resolveDomains = useCallback(
    (trimmedAddress: string) => {
      let ensAddress = ''
      let udAddress = ''

      Promise.all([
        resolveUDomain(trimmedAddress)
          .then((newUDAddress: string) => {
            udAddress = newUDAddress

            // Don't save the resolved UD address because it won't be used anywhere for now
            // https://github.com/AmbireTech/ambire-app/issues/2681#issuecomment-2299460748
            // if (udAddress) {
            //   dispatch({
            //     type: 'DOMAINS_CONTROLLER_SAVE_RESOLVED_REVERSE_LOOKUP',
            //     params: {
            //       address: udAddress,
            //       name: fieldValue,
            //       type: 'ud'
            //     }
            //   })
            // }
          })
          .catch(() => {
            udAddress = ''
            addToast('Something went wrong while resolving Unstoppable domainsⓇ domain.', {
              type: 'error'
            })
          }),
        resolveENSDomain(trimmedAddress)
          .then((newEnsAddress: string) => {
            ensAddress = newEnsAddress

            if (ensAddress) {
              dispatch({
                type: 'DOMAINS_CONTROLLER_SAVE_RESOLVED_REVERSE_LOOKUP',
                params: {
                  address: ensAddress,
                  name: fieldValue,
                  type: 'ens'
                }
              })
            }
          })
          .catch(() => {
            ensAddress = ''
            addToast('Something went wrong while resolving Ethereum Name ServicesⓇ domain.', {
              type: 'error'
            })
          })
      ])
        .catch(() => {
          ensAddress = ''
          udAddress = ''
          addToast('Something went wrong while resolving domain.', { type: 'error' })
        })
        .finally(() => {
          // The promises may resolve after the component is unmounted.
          if (fieldValueRef.current !== fieldValue) return

          setAddressState({
            ensAddress,
            udAddress,
            isDomainResolving: false
          })
        })
    },
    [addToast, fieldValue, dispatch, setAddressState]
  )

  useEffect(() => {
    const trimmedAddress = fieldValue.trim()

    const domainRegex = /^[a-zA-Z0-9-]{1,63}(\.[a-zA-Z0-9-]{1,})+/
    const canBeEnsOrUd = domainRegex.test(trimmedAddress)

    if (!trimmedAddress || !canBeEnsOrUd) {
      setAddressState({
        ensAddress: '',
        udAddress: '',
        isDomainResolving: false
      })
      return
    }

    setAddressState({
      isDomainResolving: true
    })

    // Debounce domain resolving
    const timeout = setTimeout(() => {
      resolveDomains(trimmedAddress)
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [fieldValue, resolveDomains, setAddressState])

  useEffect(() => {
    fieldValueRef.current = addressState.fieldValue
  }, [addressState.fieldValue])

  useEffect(() => {
    if (!handleRevalidate) return

    handleRevalidate()
  }, [handleRevalidate, validation])

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
    if (addressState?.fieldValue !== debouncedFieldValue) return false
    // Disable the form if there is an error
    if (validation?.isError) return validation.message

    if (addressState.isDomainResolving) return false

    return true
  }, [
    addressState?.fieldValue,
    addressState.isDomainResolving,
    debouncedFieldValue,
    validation?.isError,
    validation.message
  ])

  return {
    validation,
    RHFValidate,
    resetAddressInput: reset
  }
}

export default useAddressInput
