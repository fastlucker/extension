import { Address } from 'ambire-common/src/hooks/useAddressBook'
import { useCallback } from 'react'

import useStorageController from '@common/hooks/useStorageController'

const REFERRAL_STORAGE_KEY = 'pendingReferral'

export type Referral = {
  address: string
  hexAddress: string
  type: Address['type']
}

export default function useReferral() {
  const { setItem, getItem, removeItem } = useStorageController()

  const setPendingReferral = useCallback(
    (referral: Referral) => {
      setItem(REFERRAL_STORAGE_KEY, JSON.stringify(referral))
    },
    [setItem]
  )

  const getPendingReferral = useCallback(() => {
    let pendingReferral: Referral | null = null
    try {
      pendingReferral = JSON.parse(getItem(REFERRAL_STORAGE_KEY))
    } catch {
      // fail silently
    }

    return pendingReferral
  }, [getItem])

  const removePendingReferral = useCallback(() => {
    removeItem(REFERRAL_STORAGE_KEY)
  }, [removeItem])

  return {
    setPendingReferral,
    getPendingReferral,
    removePendingReferral
  }
}
