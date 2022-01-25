import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { Vibration } from 'react-native'

import { SECURE_STORE_KEY } from '@modules/settings/constants'

// TODO:
export enum PASSCODE_STATES {
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
  addLocalAuth: () => void
  removeLocalAuth: () => void
}

const PasscodeContext = createContext<PasscodeContextData>({
  passcode: null,
  removePasscode: () => Promise.resolve(),
  addPasscode: () => Promise.resolve(),
  isLoading: true,
  hasPasscode: false,
  isValidPasscode: () => false,
  isLocalAuthSupported: null,
  hasLocalAuth: null,
  addLocalAuth: () => {},
  removeLocalAuth: () => {},
  state: PASSCODE_STATES.NO_PASSCODE
})

const PasscodeProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<PASSCODE_STATES>(PASSCODE_STATES.NO_PASSCODE)
  const [passcode, setPasscode] = useState<null | string>(null)
  const [isLocalAuthSupported, setIsLocalAuthSupported] = useState<null | boolean>(null)
  const [hasLocalAuth, setHasLocalAuth] = useState<null | boolean>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      // Check if hardware supports local authentication
      const isCompatible = await LocalAuthentication.hasHardwareAsync()
      setIsLocalAuthSupported(isCompatible)

      const secureStoreItem = await SecureStore.getItemAsync(SECURE_STORE_KEY)
      if (secureStoreItem) {
        setPasscode(secureStoreItem)
        setState(PASSCODE_STATES.PASSCODE_ONLY)
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      setHasLocalAuth(isEnrolled)
      if (isEnrolled) {
        setState(PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH)
      }

      setIsLoading(false)
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
          addLocalAuth,
          removeLocalAuth,
          state
        }),
        [passcode, isLoading, isLocalAuthSupported, hasLocalAuth, removeLocalAuth, state]
      )}
    >
      {children}
    </PasscodeContext.Provider>
  )
}

export { PasscodeContext, PasscodeProvider }
