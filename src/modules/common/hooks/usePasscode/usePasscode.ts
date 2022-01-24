import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'

import { SECURE_STORE_KEY } from '@modules/settings/constants'

export default function usePasscode() {
  const [passcode, setPasscode] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      const secureStoreItem = await SecureStore.getItemAsync(SECURE_STORE_KEY)
      if (secureStoreItem) {
        setPasscode(secureStoreItem)
      }
      setIsLoading(false)
    })()
  }, [])

  return { passcode, isLoading, hasPasscode: !!passcode }
}
