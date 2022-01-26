import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { Platform, Vibration } from 'react-native'

import i18n from '@config/localization/localization'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import { SECURE_STORE_KEY_PASSCODE } from '@modules/settings/constants'

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

const getDeviceSupportedAuthTypesLabel = (types: DEVICE_SUPPORTED_AUTH_TYPES[]) => {
  if (Platform.OS === 'ios') {
    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)
    ) {
      return i18n.t('Face ID or Touch ID')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION)) {
      return i18n.t('Face ID')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)) {
      return i18n.t('Touch ID')
    }
  }

  if (Platform.OS === 'android') {
    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.IRIS) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)
    ) {
      return i18n.t('facial recognition, iris recognition or fingerprint')
    }

    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.IRIS) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)
    ) {
      return i18n.t('iris recognition or fingerprint')
    }

    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)
    ) {
      return i18n.t('facial recognition or fingerprint')
    }

    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.IRIS)
    ) {
      return i18n.t('facial recognition or iris recognition')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION)) {
      return i18n.t('facial recognition')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.IRIS)) {
      return i18n.t('iris recognition')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)) {
      return i18n.t('fingerprint')
    }
  }

  return ''
}

type PasscodeContextData = {
  state: PASSCODE_STATES
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL
  deviceSupportedAuthTypes: DEVICE_SUPPORTED_AUTH_TYPES[]
  deviceSupportedAuthTypesLabel: string
  removePasscode: () => Promise<void>
  addPasscode: (code: string) => Promise<void>
  isLoading: boolean
  isValidPasscode: (code: string) => boolean
  isLocalAuthSupported: null | boolean
  addLocalAuth: () => void
  removeLocalAuth: () => void
  isValidLocalAuth: () => Promise<boolean>
}

const PasscodeContext = createContext<PasscodeContextData>({
  removePasscode: () => Promise.resolve(),
  addPasscode: () => Promise.resolve(),
  isLoading: true,
  isValidPasscode: () => false,
  isLocalAuthSupported: null,
  addLocalAuth: () => {},
  removeLocalAuth: () => {},
  isValidLocalAuth: () => Promise.resolve(false),
  state: PASSCODE_STATES.NO_PASSCODE,
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL.NONE,
  deviceSupportedAuthTypes: [],
  deviceSupportedAuthTypesLabel: ''
})

const PasscodeProvider: React.FC = ({ children }) => {
  const { selectedAccHasPassword, removeSelectedAccPassword } = useAccountsPasswords()
  const [state, setState] = useState<PASSCODE_STATES>(PASSCODE_STATES.NO_PASSCODE)
  const [deviceSecurityLevel, setDeviceSecurityLevel] = useState<DEVICE_SECURITY_LEVEL>(
    DEVICE_SECURITY_LEVEL.NONE
  )
  const [deviceSupportedAuthTypes, setDeviceSupportedAuthTypes] = useState<
    DEVICE_SUPPORTED_AUTH_TYPES[]
  >([])
  const [deviceSupportedAuthTypesLabel, setDeviceSupportedAuthTypesLabel] = useState<string>('')
  const [passcode, setPasscode] = useState<null | string>(null)
  const [isLocalAuthSupported, setIsLocalAuthSupported] = useState<null | boolean>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      // Check if hardware supports local authentication
      const isCompatible = await LocalAuthentication.hasHardwareAsync()
      setIsLocalAuthSupported(isCompatible)

      const secureStoreItemPasscode = await SecureStore.getItemAsync(SECURE_STORE_KEY_PASSCODE)
      if (secureStoreItemPasscode) {
        setPasscode(secureStoreItemPasscode)
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
      setDeviceSupportedAuthTypes(deviceAuthTypes)
      // @ts-ignore `LocalAuthentication.AuthenticationType` and `DEVICE_SUPPORTED_AUTH_TYPES`
      // overlap each other. So these should match.
      setDeviceSupportedAuthTypesLabel(getDeviceSupportedAuthTypesLabel(deviceAuthTypes))

      setIsLoading(false)
    })()
  }, [])

  const addLocalAuth = async () => {
    const { success } = await LocalAuthentication.authenticateAsync()

    if (success) {
      setState(PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH)
    }
  }
  const removeLocalAuth = async () => {
    await LocalAuthentication.cancelAuthenticate()

    setState(PASSCODE_STATES.PASSCODE_ONLY)
  }
  const isValidLocalAuth = async () => {
    const { success } = await LocalAuthentication.authenticateAsync()

    return success
  }

  const addPasscode = async (code: string) => {
    await SecureStore.setItemAsync(SECURE_STORE_KEY_PASSCODE, code)
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
    // First, remove the local auth (if set), because without passcode
    // using local auth is not allowed.
    if (state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH) {
      await removeLocalAuth()
    }
    // And remove the account password stored too, because without passcode,
    // this is not allowed neither.
    if (selectedAccHasPassword) {
      await removeSelectedAccPassword()
    }

    await SecureStore.deleteItemAsync(SECURE_STORE_KEY_PASSCODE)
    setPasscode(null)

    return setState(PASSCODE_STATES.NO_PASSCODE)
  }
  const isValidPasscode = (code: string) => {
    const isValid = code === passcode

    if (!isValid) Vibration.vibrate()

    return isValid
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
          isValidLocalAuth,
          state,
          deviceSecurityLevel,
          deviceSupportedAuthTypes,
          deviceSupportedAuthTypesLabel
        }),
        [
          isLoading,
          isLocalAuthSupported,
          deviceSecurityLevel,
          deviceSupportedAuthTypes,
          deviceSupportedAuthTypesLabel,
          state
        ]
      )}
    >
      {children}
    </PasscodeContext.Provider>
  )
}

export { PasscodeContext, PasscodeProvider }
