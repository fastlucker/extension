import { BlurView } from 'expo-blur'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, StyleSheet, Vibration, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isAndroid, isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import i18n from '@config/localization/localization'
import { SyncStorage } from '@config/storage'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import BottomSheet from '@modules/common/components/BottomSheet'
import PasscodeAuth from '@modules/common/components/PasscodeAuth'
import SafeAreaView from '@modules/common/components/SafeAreaView'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import useAppLock from '@modules/common/hooks/useAppLock'
import useToast from '@modules/common/hooks/useToast'
import { getDeviceSupportedAuthTypesLabel } from '@modules/common/services/device'
import { requestLocalAuthFlagging } from '@modules/common/services/requestPermissionFlagging'
import {
  IS_LOCAL_AUTH_ACTIVATED_KEY,
  LOCK_ON_STARTUP_KEY,
  LOCK_WHEN_INACTIVE_KEY,
  SECURE_STORE_KEY_PASSCODE
} from '@modules/settings/constants'

import { DEVICE_SECURITY_LEVEL, DEVICE_SUPPORTED_AUTH_TYPES, PASSCODE_STATES } from './constants'
import styles from './styles'
import { passcodeContextDefaults, PasscodeContextReturnType } from './types'

const PasscodeContext = createContext<PasscodeContextReturnType>(passcodeContextDefaults)

const PasscodeProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { authStatus } = useAuth()

  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const { t } = useTranslation()
  const { selectedAccHasPassword, removeSelectedAccPassword } = useAccountsPasswords()
  const [state, setState] = useState<PASSCODE_STATES>(passcodeContextDefaults.state)
  const [deviceSecurityLevel, setDeviceSecurityLevel] = useState<DEVICE_SECURITY_LEVEL>(
    passcodeContextDefaults.deviceSecurityLevel
  )
  const [deviceSupportedAuthTypes, setDeviceSupportedAuthTypes] = useState<
    DEVICE_SUPPORTED_AUTH_TYPES[]
  >(passcodeContextDefaults.deviceSupportedAuthTypes)
  const [deviceSupportedAuthTypesLabel, setDeviceSupportedAuthTypesLabel] = useState<string>(
    passcodeContextDefaults.deviceSupportedAuthTypesLabel
  )
  const [passcode, setPasscode] = useState<null | string>(null)
  const [isLocalAuthSupported, setIsLocalAuthSupported] = useState<null | boolean>(
    passcodeContextDefaults.isLocalAuthSupported
  )
  const [isLoading, setIsLoading] = useState<boolean>(passcodeContextDefaults.isLoading)
  const [passcodeError, setPasscodeError] = useState<string>('')
  const [hasEnteredValidPasscode, setHasEnteredValidPasscode] = useState<null | boolean>(
    passcodeContextDefaults.hasEnteredValidPasscode
  )
  // App locking configurations
  const [isAppLocked, setIsAppLocked] = useState(false)
  const [lockOnStartup, setLockOnStartup] = useState(passcodeContextDefaults.lockOnStartup)
  const [lockWhenInactive, setLockWhenInactive] = useState(passcodeContextDefaults.lockWhenInactive)

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
        const isLocalAuthActivated = await SyncStorage.getItem(IS_LOCAL_AUTH_ACTIVATED_KEY)
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
        const lockOnStartupItem = SyncStorage.getItem(LOCK_ON_STARTUP_KEY)
        const lockWhenInactiveItem = SyncStorage.getItem(LOCK_WHEN_INACTIVE_KEY)
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

  const isValidLocalAuth = useCallback(async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: t('Confirm your identity')
      })

      return success
    } catch (e) {
      addToast(t('Authentication attempt failed.') as string, { error: true })
      return false
    }
  }, [addToast, t])

  const handleValidationSuccess = useCallback(() => {
    setPasscodeError('')

    if (isAppLocked) {
      return setIsAppLocked(false)
    }

    closeBottomSheet()
    setHasEnteredValidPasscode(true)
  }, [isAppLocked, closeBottomSheet])

  const triggerValidateLocalAuth = useCallback(async () => {
    const isValid = await requestLocalAuthFlagging(isValidLocalAuth)

    if (!isValid) {
      return
    }

    handleValidationSuccess()
  }, [handleValidationSuccess, isValidLocalAuth])

  useAppLock(
    state,
    isAppLocked,
    lockWhenInactive,
    triggerValidateLocalAuth,
    setIsAppLocked,
    setPasscodeError
  )

  const enableLockOnStartup = useCallback(async () => {
    try {
      SyncStorage.setItem(LOCK_ON_STARTUP_KEY, 'true')
      setLockOnStartup(true)

      addToast(t('Lock on startup enabled.') as string, {
        timeout: 3000
      })
    } catch (e) {
      addToast(t('Enabling lock on startup failed.') as string, {
        error: true
      })
    }
  }, [addToast, t])

  const disableLockOnStartup = useCallback(async () => {
    try {
      SyncStorage.removeItem(LOCK_ON_STARTUP_KEY)
      setLockOnStartup(false)

      addToast(t('Lock on startup disabled.') as string, {
        timeout: 3000
      })
    } catch (e) {
      addToast(t('Disabling lock on startup failed.') as string, {
        error: true
      })
    }
  }, [addToast, t])

  const enableLockWhenInactive = useCallback(async () => {
    try {
      SyncStorage.setItem(LOCK_WHEN_INACTIVE_KEY, 'true')
      setLockWhenInactive(true)

      addToast(t('Lock when inactive enabled.') as string, {
        timeout: 3000
      })
    } catch (e) {
      addToast(t('Enabling lock when inactive failed.') as string, {
        error: true
      })
    }
  }, [addToast, t])
  const disableLockWhenInactive = useCallback(async () => {
    try {
      SyncStorage.removeItem(LOCK_WHEN_INACTIVE_KEY)
      setLockWhenInactive(false)

      addToast(t('Lock when inactive is disabled.') as string, {
        timeout: 8000
      })
    } catch (e) {
      addToast(t('Disabling lock when inactive failed.') as string, {
        error: true
      })
    }
  }, [addToast, t])

  const addLocalAuth = useCallback(async () => {
    try {
      const { success } = await requestLocalAuthFlagging(() =>
        LocalAuthentication.authenticateAsync({
          promptMessage: t('Confirm your identity')
        })
      )

      if (success) {
        SyncStorage.setItem(IS_LOCAL_AUTH_ACTIVATED_KEY, 'true')
        setState(PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH)
      }
      return success
    } catch (e) {
      addToast(t('Enabling local auth failed.') as string, {
        error: true
      })
      return false
    }
  }, [addToast, t])
  const removeLocalAuth = useCallback(async () => {
    try {
      SyncStorage.removeItem(IS_LOCAL_AUTH_ACTIVATED_KEY)
      setState(PASSCODE_STATES.PASSCODE_ONLY)
    } catch (e) {
      addToast(t('Local auth got disabled, but this setting failed to save.') as string, {
        error: true
      })
    }
  }, [addToast, t])

  const addPasscode = useCallback(
    async (code: string) => {
      try {
        await SecureStore.setItemAsync(SECURE_STORE_KEY_PASSCODE, code)

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

        return true
      } catch (e) {
        return false
      }
    },
    [setPasscode, state, enableLockOnStartup]
  )
  const removePasscode = useCallback(
    async (accountId?: string) => {
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
    },
    [
      addToast,
      t,
      setState,
      selectedAccHasPassword,
      removeLocalAuth,
      removeSelectedAccPassword,
      lockOnStartup,
      lockWhenInactive,
      disableLockOnStartup,
      disableLockWhenInactive,
      state
    ]
  )
  const isValidPasscode = useCallback(
    (code: string) => {
      const isValid = code === passcode

      if (!isValid) {
        setPasscodeError(t('Wrong passcode.'))
        Vibration.vibrate(200)
      }

      return isValid
    },
    [passcode, setPasscodeError, t]
  )

  const triggerEnteringPasscode = useCallback(() => {
    openBottomSheet()

    if (state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH) {
      triggerValidateLocalAuth()
    }
  }, [openBottomSheet, state, triggerValidateLocalAuth])

  const fallbackSupportedAuthTypesLabel =
    Platform.select({
      ios: i18n.t('passcode'),
      android: i18n.t('PIN / pattern')
    }) || passcodeContextDefaults.fallbackSupportedAuthTypesLabel

  const handleOnValidatePasscode = useCallback(
    (code: string) => {
      const isValid = isValidPasscode(code)

      if (!isValid) {
        return setHasEnteredValidPasscode(false)
      }

      handleValidationSuccess()
    },
    [isValidPasscode, handleValidationSuccess]
  )

  const resetValidPasscodeEntered = useCallback(() => {
    setHasEnteredValidPasscode(null)
  }, [setHasEnteredValidPasscode])

  const lockedContainerFullScreen = (
    <SafeAreaView>
      <AmbireLogo shouldExpand={false} />
      <PasscodeAuth
        autoFocus={state !== PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH && !isWeb}
        title={t('Unlock Ambire')}
        message={t('Entering your passcode.')}
        onFulfill={handleOnValidatePasscode}
        onValidateLocalAuth={triggerValidateLocalAuth}
        error={passcodeError}
        state={state}
        deviceSupportedAuthTypesLabel={deviceSupportedAuthTypesLabel}
        fallbackSupportedAuthTypesLabel={fallbackSupportedAuthTypesLabel}
      />
    </SafeAreaView>
  )

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
          hasEnteredValidPasscode,
          lockOnStartup,
          lockWhenInactive,
          addLocalAuth,
          addPasscode,
          disableLockOnStartup,
          disableLockWhenInactive,
          enableLockOnStartup,
          enableLockWhenInactive,
          isValidLocalAuth,
          isValidPasscode,
          removeLocalAuth,
          removePasscode,
          triggerEnteringPasscode,
          resetValidPasscodeEntered
        ]
      )}
    >
      {children}

      {isAppLocked &&
        (isAndroid ? (
          <View
            style={[StyleSheet.absoluteFill, styles.lockedContainer, styles.lockedContainerAndroid]}
          >
            {lockedContainerFullScreen}
          </View>
        ) : (
          <BlurView
            intensity={55}
            tint="dark"
            style={[StyleSheet.absoluteFill, styles.lockedContainer]}
          >
            {lockedContainerFullScreen}
          </BlurView>
        ))}

      <BottomSheet id="passcode" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
        <PasscodeAuth
          onFulfill={handleOnValidatePasscode}
          autoFocus={state !== PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH && !isWeb}
          onValidateLocalAuth={triggerValidateLocalAuth}
          error={passcodeError}
          state={state}
          deviceSupportedAuthTypesLabel={deviceSupportedAuthTypesLabel}
          fallbackSupportedAuthTypesLabel={fallbackSupportedAuthTypesLabel}
        />
      </BottomSheet>
    </PasscodeContext.Provider>
  )
}

export { PasscodeContext, PasscodeProvider }
