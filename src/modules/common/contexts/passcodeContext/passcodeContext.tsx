import * as LocalAuthentication from 'expo-local-authentication'
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
  isLocalAuthSupported: null | boolean
  hasLocalAuth: null | boolean
  isLoadingLocalAuth: boolean
}

const PasscodeContext = createContext<PasscodeContextData>({
  passcode: null,
  removePasscode: () => Promise.resolve(),
  addPasscode: () => Promise.resolve(),
  isLoading: true,
  isLoadingLocalAuth: true,
  hasPasscode: false,
  isValidPasscode: () => false,
  isLocalAuthSupported: null,
  hasLocalAuth: null
})

const PasscodeProvider: React.FC = ({ children }) => {
  const [passcode, setPasscode] = useState<null | string>(null)
  const [isLocalAuthSupported, setIsLocalAuthSupported] = useState<null | boolean>(null)
  const [hasLocalAuth, setHasLocalAuth] = useState<null | boolean>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingLocalAuth, setIsLoadingLocalAuth] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      const secureStoreItem = await SecureStore.getItemAsync(SECURE_STORE_KEY)
      if (secureStoreItem) {
        setPasscode(secureStoreItem)
      }
      setIsLoading(false)
    })()
  }, [])

  // Check if hardware supports local authentication
  useEffect(() => {
    ;(async () => {
      const isCompatible = await LocalAuthentication.hasHardwareAsync()
      setIsLocalAuthSupported(isCompatible)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      setHasLocalAuth(isEnrolled)
      setIsLoadingLocalAuth(false)
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
          isValidPasscode,
          isLocalAuthSupported,
          hasLocalAuth,
          isLoadingLocalAuth
        }),
        [passcode, isLoading, isLocalAuthSupported, hasLocalAuth, isLoadingLocalAuth]
      )}
    >
      {children}
    </PasscodeContext.Provider>
  )
}

export { PasscodeContext, PasscodeProvider }
