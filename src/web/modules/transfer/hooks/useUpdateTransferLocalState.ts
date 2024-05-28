import React, { useEffect, useState } from 'react'

import { AddressState } from '@ambire-common/interfaces/domains'

const useUpdateTransferLocalState = ({
  isInitialized,
  setLocalAmount,
  setLocalAddressState,
  amount,
  addressState
}: {
  isInitialized: boolean
  setLocalAmount: React.Dispatch<React.SetStateAction<string>>
  setLocalAddressState: React.Dispatch<React.SetStateAction<AddressState>>
  amount: string
  addressState: AddressState
}) => {
  const [isUpdatingLocalState, setIsUpdatingLocalState] = useState(true)

  useEffect(() => {
    // Local state < --- Controller state on initialization
    if (!isInitialized) return

    setLocalAmount(amount)
    setLocalAddressState(addressState)
    setIsUpdatingLocalState(false)
    // Don't add other dependencies to this useEffect. It's meant to run
    // only once after the controller is initialized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized])

  useEffect(() => {
    // Local state < --- Controller state on tab focus
    // Synced on visibility change
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setLocalAmount(amount)
        setLocalAddressState(addressState)

        if (isUpdatingLocalState) setIsUpdatingLocalState(false)
      } else {
        setIsUpdatingLocalState(true)
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [addressState, amount, isUpdatingLocalState, setLocalAddressState, setLocalAmount])

  return {
    isUpdatingLocalState
  }
}

export default useUpdateTransferLocalState
