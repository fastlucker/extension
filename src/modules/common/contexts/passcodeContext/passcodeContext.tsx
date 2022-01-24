import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { Vibration } from 'react-native'

import { SECURE_STORE_KEY } from '@modules/settings/constants'

// TODO:
enum PASSCODE_STATES {
  UNKNOWN = 'UNKNOWN',
  NO_PASSCODE = 'NO_PASSCODE',
  PASSCODE_ONLY = 'PASSCODE_ONLY',
  PASSCODE_AND_LOCAL_AUTH = 'PASSCODE_ONLY'
}

type PasscodeContextData = {
  state: PASSCODE_STATES
  passcode: null | string
  removePasscode: () => Promise<void>
  addPasscode: (code: string) => Promise<void>
  isLoading: boolean
  hasPasscode: boolean
  isValidPasscode: (code: string) => boolean
  isLocalAuthSupported: null | boolean
  hasLocalAuth: null | boolean
  isLoadingLocalAuth: boolean
  addLocalAuth: () => void
  removeLocalAuth: () => void
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
  hasLocalAuth: null,
  addLocalAuth: () => {},
  removeLocalAuth: () => {},
  state: PASSCODE_STATES.UNKNOWN
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

  const addPasscode = async (code: string) => {
    await SecureStore.setItemAsync(SECURE_STORE_KEY, code)
    setPasscode(code)
  }
  const removePasscode = async () => {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEY)
    setPasscode(null)
  }
  const isValidPasscode = (code: string) => {
    const isValid = code === passcode

    if (!isValid) Vibration.vibrate()

    return isValid
  }

  const addLocalAuth = async () => {
    const { success } = await LocalAuthentication.authenticateAsync()

    setHasLocalAuth(success)
  }
  const removeLocalAuth = async () => {
    setHasLocalAuth(false)
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
          isLoadingLocalAuth,
          addLocalAuth,
          removeLocalAuth
        }),
        [
          passcode,
          isLoading,
          isLocalAuthSupported,
          hasLocalAuth,
          isLoadingLocalAuth,
          removeLocalAuth
        ]
      )}
    >
      {children}
    </PasscodeContext.Provider>
  )
}

export { PasscodeContext, PasscodeProvider }
