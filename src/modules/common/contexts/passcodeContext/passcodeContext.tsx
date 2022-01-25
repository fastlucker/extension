import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { Vibration } from 'react-native'

import { SECURE_STORE_KEY } from '@modules/settings/constants'

// TODO:
export enum PASSCODE_STATES {
  NO_PASSCODE = 'NO_PASSCODE',
  PASSCODE_ONLY = 'PASSCODE_ONLY',
  PASSCODE_AND_LOCAL_AUTH = 'PASSCODE_AND_LOCAL_AUTH'
}

type PasscodeContextData = {
  state: PASSCODE_STATES
  removePasscode: () => Promise<void>
  addPasscode: (code: string) => Promise<void>
  isLoading: boolean
  isValidPasscode: (code: string) => boolean
  isLocalAuthSupported: null | boolean
  addLocalAuth: () => void
  removeLocalAuth: () => void
}

const PasscodeContext = createContext<PasscodeContextData>({
  removePasscode: () => Promise.resolve(),
  addPasscode: () => Promise.resolve(),
  isLoading: true,
  isValidPasscode: () => false,
  isLocalAuthSupported: null,
  addLocalAuth: () => {},
  removeLocalAuth: () => {},
  state: PASSCODE_STATES.NO_PASSCODE
})

const PasscodeProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<PASSCODE_STATES>(PASSCODE_STATES.NO_PASSCODE)
  const [passcode, setPasscode] = useState<null | string>(null)
  const [isLocalAuthSupported, setIsLocalAuthSupported] = useState<null | boolean>(null)
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
      if (isEnrolled) {
        setState(PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH)
      }

      setIsLoading(false)
    })()
  }, [])

  const addPasscode = async (code: string) => {
    await SecureStore.setItemAsync(SECURE_STORE_KEY, code)
    setPasscode(code)
    if (state === PASSCODE_STATES.NO_PASSCODE)
      setState(
        // Covers the case coming from a state with passcode already set
        state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
          ? PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
          : PASSCODE_STATES.PASSCODE_ONLY
      )
  }
  const removePasscode = async () => {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEY)
    setPasscode(null)
    setState(PASSCODE_STATES.NO_PASSCODE)
  }
  const isValidPasscode = (code: string) => {
    const isValid = code === passcode

    if (!isValid) Vibration.vibrate()

    return isValid
  }

  const addLocalAuth = async () => {
    const { success } = await LocalAuthentication.authenticateAsync()

    if (success) {
      setState(PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH)
    }
  }
  const removeLocalAuth = async () => {
    setState(PASSCODE_STATES.PASSCODE_ONLY)
  }

  return (
    <PasscodeContext.Provider
      value={useMemo(
        () => ({
          addPasscode,
          removePasscode,
          isLoading,
          isValidPasscode,
          isLocalAuthSupported,
          addLocalAuth,
          removeLocalAuth,
          state
        }),
        [isLoading, isLocalAuthSupported, state]
      )}
    >
      {children}
    </PasscodeContext.Provider>
  )
}

export { PasscodeContext, PasscodeProvider }
