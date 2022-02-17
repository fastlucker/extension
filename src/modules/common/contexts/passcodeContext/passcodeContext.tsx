import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { AppState, Platform, StyleSheet, Vibration, View } from 'react-native'

import { useTranslation } from '@config/localization'
import i18n from '@config/localization/localization'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import PasscodeAuth from '@modules/common/components/PasscodeAuth'
import SafeAreaView from '@modules/common/components/SafeAreaView'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import useToast from '@modules/common/hooks/useToast'
import { getDeviceSupportedAuthTypesLabel } from '@modules/common/services/device'
import {
  IS_LOCAL_AUTH_ACTIVATED_KEY,
  LOCK_ON_STARTUP_KEY,
  LOCK_WHEN_INACTIVE_KEY,
  SECURE_STORE_KEY_PASSCODE
} from '@modules/settings/constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { DEVICE_SECURITY_LEVEL, DEVICE_SUPPORTED_AUTH_TYPES, PASSCODE_STATES } from './constants'
import styles from './styles'

type PasscodeContextData = {
  state: PASSCODE_STATES
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL
  deviceSupportedAuthTypes: DEVICE_SUPPORTED_AUTH_TYPES[]
  deviceSupportedAuthTypesLabel: string
  fallbackSupportedAuthTypesLabel: string
  addPasscode: (code: string) => Promise<void>
  removePasscode: (accountId: string) => Promise<void>
  isLoading: boolean
  isValidPasscode: (code: string) => boolean
  isLocalAuthSupported: null | boolean
  addLocalAuth: () => void
  removeLocalAuth: () => void
  isValidLocalAuth: () => Promise<boolean>
  triggerEnteringPasscode: () => void
  resetValidPasscodeEntered: () => void
  hasEnteredValidPasscode: boolean | null
  enableLockOnStartup: () => void
  disableLockOnStartup: () => void
  enableLockWhenInactive: () => void
  disableLockWhenInactive: () => void
  lockOnStartup: boolean
  lockWhenInactive: boolean
}

const defaults: PasscodeContextData = {
  state: PASSCODE_STATES.NO_PASSCODE,
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL.NONE,
  deviceSupportedAuthTypes: [],
  deviceSupportedAuthTypesLabel: '',
  fallbackSupportedAuthTypesLabel: '',
  addPasscode: () => Promise.resolve(),
  removePasscode: () => Promise.resolve(),
  isLoading: true,
  isValidPasscode: () => false,
  isLocalAuthSupported: null,
  addLocalAuth: () => {},
  removeLocalAuth: () => {},
  isValidLocalAuth: () => Promise.resolve(false),
  triggerEnteringPasscode: () => {},
  resetValidPasscodeEntered: () => {},
  hasEnteredValidPasscode: null,
  enableLockOnStartup: () => {},
  disableLockOnStartup: () => {},
  enableLockWhenInactive: () => {},
  disableLockWhenInactive: () => {},
  lockOnStartup: false,
  lockWhenInactive: false
}

const PasscodeContext = createContext<PasscodeContextData>(defaults)

const PasscodeProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { authStatus } = useAuth()
  const { sheetRef, isOpen, openBottomSheet, closeBottomSheet } = useBottomSheet()
  const { t } = useTranslation()
  const { selectedAccHasPassword, removeSelectedAccPassword } = useAccountsPasswords()
  const [state, setState] = useState<PASSCODE_STATES>(defaults.state)
  const [deviceSecurityLevel, setDeviceSecurityLevel] = useState<DEVICE_SECURITY_LEVEL>(
    defaults.deviceSecurityLevel
  )
  const [deviceSupportedAuthTypes, setDeviceSupportedAuthTypes] = useState<
    DEVICE_SUPPORTED_AUTH_TYPES[]
  >(defaults.deviceSupportedAuthTypes)
  const [deviceSupportedAuthTypesLabel, setDeviceSupportedAuthTypesLabel] = useState<string>(
    defaults.deviceSupportedAuthTypesLabel
  )
  const [passcode, setPasscode] = useState<null | string>(null)
  const [isLocalAuthSupported, setIsLocalAuthSupported] = useState<null | boolean>(
    defaults.isLocalAuthSupported
  )
  const [isLoading, setIsLoading] = useState<boolean>(defaults.isLoading)
  const [hasEnteredValidPasscode, setHasEnteredValidPasscode] = useState<null | boolean>(
    defaults.hasEnteredValidPasscode
  )
  // App locking configurations
  const [isAppLocked, setIsAppLocked] = useState(false)
  const [lockOnStartup, setLockOnStartup] = useState(defaults.lockOnStartup)
  const [lockWhenInactive, setLockWhenInactive] = useState(defaults.lockWhenInactive)

  useEffect(() => {
    ;(async () => {
      if (authStatus !== AUTH_STATUS.AUTHENTICATED) return

      // Check if hardware supports local authentication
      try {
        const isCompatible = await LocalAuthentication.hasHardwareAsync()
        setIsLocalAuthSupported(isCompatible)
      } catch (e) {
        // fail silently
      }

      try {
        const secureStoreItemPasscode = await SecureStore.getItemAsync(SECURE_STORE_KEY_PASSCODE)
        if (secureStoreItemPasscode) {
          setPasscode(secureStoreItemPasscode)
          setState(PASSCODE_STATES.PASSCODE_ONLY)
        }
      } catch (e) {
        // fail silently
      }

      try {
        const isLocalAuthActivated = await AsyncStorage.getItem(IS_LOCAL_AUTH_ACTIVATED_KEY)
        if (isLocalAuthActivated) {
          setState(PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH)
        }
      } catch (e) {
        // fail silently
      }

      try {
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
      } catch (e) {
        // fail silently
      }

      try {
        const deviceAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
        // @ts-ignore `LocalAuthentication.AuthenticationType` and `DEVICE_SUPPORTED_AUTH_TYPES`
        // overlap each other. So these should match.
        setDeviceSupportedAuthTypes(deviceAuthTypes)
        // @ts-ignore `LocalAuthentication.AuthenticationType` and `DEVICE_SUPPORTED_AUTH_TYPES`
        // overlap each other. So these should match.
        setDeviceSupportedAuthTypesLabel(getDeviceSupportedAuthTypesLabel(deviceAuthTypes))
      } catch (e) {
        // fail silently
      }

      try {
        const [lockOnStartupItem, lockWhenInactiveItem] = await Promise.all([
          AsyncStorage.getItem(LOCK_ON_STARTUP_KEY),
          AsyncStorage.getItem(LOCK_WHEN_INACTIVE_KEY)
        ])
        setLockOnStartup(!!lockOnStartupItem)
        setLockWhenInactive(!!lockWhenInactiveItem)

        if (lockOnStartupItem) {
          setIsAppLocked(true)
        }
      } catch (e) {
        // fail silently
      }

      setIsLoading(false)
    })()
  }, [authStatus])

  useEffect(() => {
    if (isLoading) return
    if (authStatus !== AUTH_STATUS.AUTHENTICATED) return
    if (!lockWhenInactive) return

    const lockListener = AppState.addEventListener('change', (nextState) => {
      // The app is running in the background means that user is either:
      // in another app, on the home screen or [Android] on another Activity
      // (even if it was launched by our app).
      if (nextState === 'background' && !global.isAskingForPermission) {
        setIsAppLocked(true)
      }
    })
    return () => lockListener?.remove()
  }, [isLoading, lockWhenInactive, authStatus])

  // When app starts, immediately prompt user for local auth validation.
  useEffect(() => {
    const shouldPromptLocalAuth = isAppLocked && state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
    if (shouldPromptLocalAuth) {
      triggerValidateLocalAuth()
    }
  }, [isAppLocked, state])

  const enableLockOnStartup = async () => {
    try {
      await AsyncStorage.setItem(LOCK_ON_STARTUP_KEY, 'true')
      setLockOnStartup(true)

      addToast(t('Lock on startup enabled.') as string, {
        timeout: 3000
      })
    } catch (e) {
      addToast(t('Enabling lock on startup failed.') as string, {
        error: true
      })
    }
  }
  const disableLockOnStartup = async () => {
    try {
      await AsyncStorage.removeItem(LOCK_ON_STARTUP_KEY)
      setLockOnStartup(false)

      addToast(t('Lock on startup disabled.') as string, {
        timeout: 3000
      })
    } catch (e) {
      addToast(t('Disabling lock on startup failed.') as string, {
        error: true
      })
    }
  }

  const enableLockWhenInactive = async () => {
    try {
      await AsyncStorage.setItem(LOCK_WHEN_INACTIVE_KEY, 'true')
      setLockWhenInactive(true)

      addToast(t('Lock when inactive enabled.') as string, {
        timeout: 3000
      })
    } catch (e) {
      addToast(t('Enabling lock when inactive failed.') as string, {
        error: true
      })
    }
  }
  const disableLockWhenInactive = async () => {
    try {
      await AsyncStorage.removeItem(LOCK_WHEN_INACTIVE_KEY)
      setLockWhenInactive(false)

      addToast(
        t(
          'Lock when inactive disabled. It will take effect next time you start the app.'
        ) as string,
        {
          timeout: 8000
        }
      )
    } catch (e) {
      addToast(t('Disabling lock when inactive failed.') as string, {
        error: true
      })
    }
  }

  const addLocalAuth = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync()
      if (success) {
        await AsyncStorage.setItem(IS_LOCAL_AUTH_ACTIVATED_KEY, 'true')

        setState(PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH)
      }
    } catch (e) {
      addToast(t('Enabling local auth failed.') as string, {
        error: true
      })
    }
  }
  const removeLocalAuth = async () => {
    try {
      await AsyncStorage.removeItem(IS_LOCAL_AUTH_ACTIVATED_KEY)

      setState(PASSCODE_STATES.PASSCODE_ONLY)
    } catch (e) {
      addToast(t('Local auth got disabled, but this setting failed to save.') as string, {
        error: true
      })
    }
  }
  const isValidLocalAuth = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: t('Confirm your identity')
      })

      return success
    } catch (e) {
      addToast(t('Authentication attempt failed.') as string, { error: true })
      return false
    }
  }
  const handleValidationSuccess = () => {
    if (isAppLocked) {
      return setIsAppLocked(false)
    }

    closeBottomSheet()
    setHasEnteredValidPasscode(true)
  }

  const triggerValidateLocalAuth = async () => {
    const isValid = await isValidLocalAuth()
    if (!isValid) {
      return
    }

    handleValidationSuccess()
  }

  const addPasscode = async (code: string) => {
    try {
      await SecureStore.setItemAsync(SECURE_STORE_KEY_PASSCODE, code)
    } catch (e) {
      // Fail silently. Means that will still set a passcode,
      // however, it won't store it in the secure storage and therefore,
      // on the next app load - the passcode won't be persisted.
      // Not great, not terrible.
    }

    setPasscode(code)

    if (state === PASSCODE_STATES.NO_PASSCODE) {
      enableLockOnStartup()
    }

    setState(
      // Covers the case coming from a state with passcode already set
      state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
        ? PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
        : PASSCODE_STATES.PASSCODE_ONLY
    )
  }
  const removePasscode = async (accountId?: string) => {
    // In case the remove `passcode` is called with another account,
    // than the currently selected one, removing the account password
    // has already happened. So skip it.
    if (!accountId) {
      // Remove the account password stored, because without passcode,
      // this is not allowed.
      if (selectedAccHasPassword) {
        await removeSelectedAccPassword()
      }
    }

    // First, remove the local auth (if set), because without passcode
    // using local auth is not allowed.
    if (state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH) {
      await removeLocalAuth()
    }

    // Disable lock on startup and when inactive, , because without passcode
    // these are no longer relevant.
    if (lockOnStartup) {
      disableLockOnStartup()
    }
    if (lockWhenInactive) {
      disableLockWhenInactive()
    }

    try {
      await SecureStore.deleteItemAsync(SECURE_STORE_KEY_PASSCODE)
    } catch (e) {
      addToast(t('Passcode got removed, but this setting failed to save.') as string, {
        error: true
      })
    }

    setPasscode(null)

    return setState(PASSCODE_STATES.NO_PASSCODE)
  }
  const isValidPasscode = (code: string) => {
    const isValid = code === passcode

    if (!isValid) Vibration.vibrate()

    return isValid
  }

  const triggerEnteringPasscode = () => {
    openBottomSheet()

    if (state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH) {
      triggerValidateLocalAuth()
    }
  }

  const fallbackSupportedAuthTypesLabel =
    Platform.select({
      ios: i18n.t('passcode'),
      android: i18n.t('PIN / pattern')
    }) || defaults.fallbackSupportedAuthTypesLabel

  const handleOnValidatePasscode = (code: string) => {
    const isValid = isValidPasscode(code)

    if (!isValid) {
      return setHasEnteredValidPasscode(false)
    }

    handleValidationSuccess()
  }

  const resetValidPasscodeEntered = () => {
    setHasEnteredValidPasscode(null)
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
          deviceSupportedAuthTypesLabel,
          fallbackSupportedAuthTypesLabel,
          triggerEnteringPasscode,
          resetValidPasscodeEntered,
          hasEnteredValidPasscode,
          lockOnStartup,
          lockWhenInactive,
          enableLockOnStartup,
          disableLockOnStartup,
          enableLockWhenInactive,
          disableLockWhenInactive
        }),
        [
          isLoading,
          isLocalAuthSupported,
          deviceSecurityLevel,
          deviceSupportedAuthTypes,
          deviceSupportedAuthTypesLabel,
          fallbackSupportedAuthTypesLabel,
          state,
          isAppLocked,
          hasEnteredValidPasscode,
          // By including this, when calling the `removePasscode` method,
          // it makes the `useAccountsPasswords` context re-render too.
          selectedAccHasPassword,
          lockOnStartup,
          lockWhenInactive
        ]
      )}
    >
      {children}

      {isAppLocked && (
        <View style={[StyleSheet.absoluteFill, styles.lockedContainer]}>
          <SafeAreaView>
            <PasscodeAuth
              autoFocus={state !== PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH}
              title={t('Unlock Ambire Wallet')}
              message={t('Entering your passcode.')}
              onFulfill={handleOnValidatePasscode}
              onValidateLocalAuth={triggerValidateLocalAuth}
              hasError={!hasEnteredValidPasscode && hasEnteredValidPasscode !== null}
              state={state}
              deviceSupportedAuthTypesLabel={deviceSupportedAuthTypesLabel}
              fallbackSupportedAuthTypesLabel={fallbackSupportedAuthTypesLabel}
            />
          </SafeAreaView>
        </View>
      )}

      <BottomSheet
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        dynamicInitialHeight={false}
      >
        <PasscodeAuth
          onFulfill={handleOnValidatePasscode}
          autoFocus={state !== PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH}
          onValidateLocalAuth={triggerValidateLocalAuth}
          hasError={!hasEnteredValidPasscode && hasEnteredValidPasscode !== null}
          state={state}
          deviceSupportedAuthTypesLabel={deviceSupportedAuthTypesLabel}
          fallbackSupportedAuthTypesLabel={fallbackSupportedAuthTypesLabel}
        />
      </BottomSheet>
    </PasscodeContext.Provider>
  )
}

export { PasscodeContext, PasscodeProvider }
