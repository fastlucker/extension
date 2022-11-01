import { BlurView } from 'expo-blur'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, StyleSheet, Vibration, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isAndroid } from '@config/env'
import { useTranslation } from '@config/localization'
import i18n from '@config/localization/localization'
import { SyncStorage } from '@config/storage'
import PinForm from '@modules/app-lock/components/PinForm'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import useBiometricsSign from '@modules/biometrics-sign/hooks/useBiometricsSign'
import BottomSheet from '@modules/common/components/BottomSheet'
import SafeAreaView from '@modules/common/components/SafeAreaView'
import useAppLock from '@modules/common/hooks/useAppLock'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import useToast from '@modules/common/hooks/useToast'
import { requestLocalAuthFlagging } from '@modules/common/services/requestPermissionFlagging'
import {
  IS_LOCAL_AUTH_ACTIVATED_KEY,
  LOCK_ON_STARTUP_KEY,
  LOCK_WHEN_INACTIVE_KEY,
  SECURE_STORE_KEY_PASSCODE
} from '@modules/settings/constants'

import { PASSCODE_STATES } from './constants'
import styles from './styles'
import { appLockContextDefaults, AppLockContextReturnType } from './types'

const AppLockContext = createContext<AppLockContextReturnType>(appLockContextDefaults)

const AppLockProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { authStatus } = useAuth()
  const { deviceSupportedAuthTypesLabel } = useBiometrics()

  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const { t } = useTranslation()
  const [state, setState] = useState<PASSCODE_STATES>(appLockContextDefaults.state)
  const [passcode, setPasscode] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState<boolean>(appLockContextDefaults.isLoading)
  const [passcodeError, setPasscodeError] = useState<string>('')
  const [hasEnteredValidPasscode, setHasEnteredValidPasscode] = useState<null | boolean>(
    appLockContextDefaults.hasEnteredValidPasscode
  )
  // App locking configurations
  const [isAppLocked, setIsAppLocked] = useState(false)
  const [lockOnStartup, setLockOnStartup] = useState(appLockContextDefaults.lockOnStartup)
  const [lockWhenInactive, setLockWhenInactive] = useState(appLockContextDefaults.lockWhenInactive)

  useEffect(() => {
    ;(async () => {
      if (authStatus !== AUTH_STATUS.AUTHENTICATED) return

      try {
        const secureStoreItemPasscode = await SecureStore.getItemAsync(SECURE_STORE_KEY_PASSCODE)
        if (secureStoreItemPasscode) {
          setPasscode(secureStoreItemPasscode)
          setState(PASSCODE_STATES.PASSCODE_ONLY)
        }
      } catch (e) {
        // fail silently
      }

      const isLocalAuthActivated = SyncStorage.getItem(IS_LOCAL_AUTH_ACTIVATED_KEY)
      if (isLocalAuthActivated) {
        setState(PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH)
      }

      const lockOnStartupItem = SyncStorage.getItem(LOCK_ON_STARTUP_KEY)
      const lockWhenInactiveItem = SyncStorage.getItem(LOCK_WHEN_INACTIVE_KEY)
      setLockOnStartup(!!lockOnStartupItem)
      setLockWhenInactive(!!lockWhenInactiveItem)

      if (lockOnStartupItem) {
        setIsAppLocked(true)
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

  const setAppLockBiometrics = useCallback(async () => {
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
  const removeAppLockBiometrics = useCallback(async () => {
    try {
      SyncStorage.removeItem(IS_LOCAL_AUTH_ACTIVATED_KEY)
      setState(PASSCODE_STATES.PASSCODE_ONLY)
    } catch (e) {
      addToast(t('Local auth got disabled, but this setting failed to save.') as string, {
        error: true
      })
    }
  }, [addToast, t])

  const setAppLockPin = useCallback(
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
  const removeAppLock = useCallback(
    async (accountId?: string) => {
      // First, remove the local auth (if set), because without passcode
      // using local auth is not allowed.
      if (state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH) {
        await removeAppLockBiometrics()
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
      removeAppLockBiometrics,
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
        setPasscodeError(t('Wrong PIN.'))
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
    }) || appLockContextDefaults.fallbackSupportedAuthTypesLabel

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
      <PinForm
        autoFocus={state !== PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH}
        title={t('Unlock Ambire')}
        message={t('Enter your PIN.')}
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
    <AppLockContext.Provider
      value={useMemo(
        () => ({
          state,
          isLoading,

          isValidPasscode,
          hasEnteredValidPasscode,
          triggerEnteringPasscode,
          resetValidPasscodeEntered,

          setAppLockPin,
          setAppLockBiometrics,
          removeAppLock,
          removeAppLockBiometrics,

          deviceSupportedAuthTypesLabel,
          fallbackSupportedAuthTypesLabel,

          lockOnStartup,
          lockWhenInactive,
          enableLockOnStartup,
          disableLockOnStartup,
          enableLockWhenInactive,
          disableLockWhenInactive
        }),
        [
          state,
          isLoading,

          isValidPasscode,
          hasEnteredValidPasscode,
          triggerEnteringPasscode,
          resetValidPasscodeEntered,

          setAppLockPin,
          setAppLockBiometrics,
          removeAppLock,
          removeAppLockBiometrics,

          deviceSupportedAuthTypesLabel,
          fallbackSupportedAuthTypesLabel,

          lockOnStartup,
          lockWhenInactive,
          disableLockOnStartup,
          disableLockWhenInactive,
          enableLockOnStartup,
          enableLockWhenInactive
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
        <PinForm
          onFulfill={handleOnValidatePasscode}
          autoFocus={state !== PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH}
          onValidateLocalAuth={triggerValidateLocalAuth}
          error={passcodeError}
          state={state}
          deviceSupportedAuthTypesLabel={deviceSupportedAuthTypesLabel}
          fallbackSupportedAuthTypesLabel={fallbackSupportedAuthTypesLabel}
        />
      </BottomSheet>
    </AppLockContext.Provider>
  )
}

export { AppLockContext, AppLockProvider }
