import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { Vibration } from 'react-native'

import { SECURE_STORE_KEY } from '@modules/settings/constants'

type PasscodeContextData = {
  passcode: null | string
  removePasscode: () => Promise<void>
  addPasscode: (code: string) => Promise<void>
  isLoading: boolean
  hasPasscode: boolean
  isValidPasscode: (code: string) => boolean
}

const PasscodeContext = createContext<PasscodeContextData>({
  passcode: null,
  removePasscode: () => Promise.resolve(),
  addPasscode: () => Promise.resolve(),
  isLoading: true,
  hasPasscode: false,
  isValidPasscode: () => false
})

const PasscodeProvider: React.FC = ({ children }) => {
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

  const isValidPasscode = (code: string) => {
    const isValid = code === passcode

    if (!isValid) Vibration.vibrate()

    return isValid
  }

  const addPasscode = async (code: string) => {
    await SecureStore.setItemAsync(SECURE_STORE_KEY, code)
    setPasscode(code)
  }

  const removePasscode = async () => {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEY)
    setPasscode(null)
  }

  return (
    <PasscodeContext.Provider
      value={useMemo(
        () => ({
          passcode,
          addPasscode,
          removePasscode,
          isLoading,
          hasPasscode: !!passcode,
          isValidPasscode
        }),
        [passcode, isLoading]
      )}
    >
      {children}
    </PasscodeContext.Provider>
  )
}

export { PasscodeContext, PasscodeProvider }
