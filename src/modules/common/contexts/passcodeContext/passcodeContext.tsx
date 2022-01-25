import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { Vibration } from 'react-native'

import { SECURE_STORE_KEY } from '@modules/settings/constants'

export enum PASSCODE_STATES {
  NO_PASSCODE = 'NO_PASSCODE',
  PASSCODE_ONLY = 'PASSCODE_ONLY',
  PASSCODE_AND_LOCAL_AUTH = 'PASSCODE_AND_LOCAL_AUTH'
}

export enum DEVICE_SECURITY_LEVEL {
  // Indicates no enrolled authentication
  NONE = LocalAuthentication.SecurityLevel.NONE,
  // Indicates non-biometric authentication (e.g. PIN, Pattern).
  SECRET = LocalAuthentication.SecurityLevel.SECRET,
  // Indicates biometric authentication
  BIOMETRIC = LocalAuthentication.SecurityLevel.BIOMETRIC
}

export enum DEVICE_SUPPORTED_AUTH_TYPES {
  FINGERPRINT = LocalAuthentication.AuthenticationType.FINGERPRINT,
  FACIAL_RECOGNITION = LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
  IRIS = LocalAuthentication.AuthenticationType.IRIS
}

type PasscodeContextData = {
  state: PASSCODE_STATES
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL
  deviceAuthTypes: DEVICE_SUPPORTED_AUTH_TYPES[]
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
  state: PASSCODE_STATES.NO_PASSCODE,
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL.NONE,
  deviceAuthTypes: []
})

const PasscodeProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<PASSCODE_STATES>(PASSCODE_STATES.NO_PASSCODE)
  const [deviceSecurityLevel, setDeviceSecurityLevel] = useState<DEVICE_SECURITY_LEVEL>(
    DEVICE_SECURITY_LEVEL.NONE
  )
  const [deviceSupportedAuthType, setDeviceSupportedAuthType] = useState<
    DEVICE_SUPPORTED_AUTH_TYPES[]
  >([])

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

      const securityLevel = await LocalAuthentication.getEnrolledLevelAsync()
      const existingDeviceSecurityLevel =
        // @ts-ignore `LocalAuthentication.SecurityLevel` and `DEVICE_SECURITY_LEVEL`
        // overlap each other. So this should match.
        Object.values(DEVICE_SECURITY_LEVEL).includes(securityLevel)
      setDeviceSecurityLevel(
        // @ts-ignore `LocalAuthentication.SecurityLevel` and `DEVICE_SECURITY_LEVEL`
        // overlap each other. So this should always result a valid setting.
        existingDeviceSecurityLevel ? securityLevel : DEVICE_SECURITY_LEVEL.NONE
      )

      const deviceAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
      // @ts-ignore `LocalAuthentication.AuthenticationType` and `DEVICE_SUPPORTED_AUTH_TYPES`
      // overlap each other. So these should match.
      setDeviceSupportedAuthType(deviceAuthTypes)

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
          state,
          deviceSecurityLevel,
          deviceAuthTypes
        }),
        [isLoading, isLocalAuthSupported, deviceSecurityLevel, deviceAuthTypes, state]
      )}
    >
      {children}
    </PasscodeContext.Provider>
  )
}

export { PasscodeContext, PasscodeProvider }
