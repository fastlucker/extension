import { BlurView } from 'expo-blur'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Vibration, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isAndroid } from '@config/env'
import { useTranslation } from '@config/localization'
import PinForm from '@modules/app-lock/components/PinForm'
import useAppLockMechanism from '@modules/app-lock/hooks/useAppLockMechanism'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import BottomSheet from '@modules/common/components/BottomSheet'
import SafeAreaView from '@modules/common/components/SafeAreaView'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import useStorageController from '@modules/common/hooks/useStorageController'
import useToast from '@modules/common/hooks/useToast'
import {
  IS_BIOMETRICS_UNLOCK_ACTIVE_KEY,
  LOCK_ON_STARTUP_KEY,
  LOCK_WHEN_INACTIVE_KEY,
  SECURE_STORE_KEY_PASSCODE
} from '@modules/settings/constants'

import { APP_LOCK_STATES } from './constants'
import styles from './styles'
import { appLockContextDefaults, AppLockContextReturnType } from './types'

const AppLockContext = createContext<AppLockContextReturnType>(appLockContextDefaults)

const AppLockProvider: React.FC = ({ children }) => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { getItem, setItem, removeItem } = useStorageController()
  const { authStatus } = useAuth()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const {
    authenticateWithLocalAuth,
    deviceSupportedAuthTypesLabel,
    fallbackSupportedAuthTypesLabel
  } = useBiometrics()
  const [lockState, setLockState] = useState<APP_LOCK_STATES>(appLockContextDefaults.lockState)
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
      // App lock logic gets triggered only for logged in users. So if not logged in, skip.
      if (authStatus !== AUTH_STATUS.AUTHENTICATED) return

      try {
        const secureStoreItemPasscode = await SecureStore.getItemAsync(SECURE_STORE_KEY_PASSCODE)
        if (secureStoreItemPasscode) {
          setPasscode(secureStoreItemPasscode)
          setLockState(APP_LOCK_STATES.PASSCODE_ONLY)
        }
      } catch {
        // fail silently
      }

      const isBiometricsUnlockActivated = getItem(IS_BIOMETRICS_UNLOCK_ACTIVE_KEY)
      if (isBiometricsUnlockActivated) {
        setLockState(APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS)
      }

      const lockOnStartupItem = getItem(LOCK_ON_STARTUP_KEY)
      const lockWhenInactiveItem = getItem(LOCK_WHEN_INACTIVE_KEY)
      setLockOnStartup(!!lockOnStartupItem)
      setLockWhenInactive(!!lockWhenInactiveItem)

      if (lockOnStartupItem) {
        setIsAppLocked(true)
      }

      setIsLoading(false)
    })()
  }, [authStatus, getItem])

  const handleValidationSuccess = useCallback(() => {
    setPasscodeError('')

    if (isAppLocked) {
      return setIsAppLocked(false)
    }

    closeBottomSheet()
    setHasEnteredValidPasscode(true)
  }, [isAppLocked, closeBottomSheet])

  const triggerValidateLocalAuth = useCallback(async () => {
    const isValid = await authenticateWithLocalAuth()

    if (!isValid) {
      return
    }

    handleValidationSuccess()
  }, [handleValidationSuccess, authenticateWithLocalAuth])

  useAppLockMechanism(
    lockState,
    isAppLocked,
    lockWhenInactive,
    triggerValidateLocalAuth,
    setIsAppLocked,
    setPasscodeError
  )

  const enableLockOnStartup = useCallback(async () => {
    try {
      setItem(LOCK_ON_STARTUP_KEY, 'true')
      setLockOnStartup(true)

      addToast(t('Lock on startup enabled.') as string, { timeout: 5000 })
    } catch (e) {
      addToast(t('Enabling lock on startup failed.') as string, { error: true })
    }
  }, [addToast, t, setItem])

  const disableLockOnStartup = useCallback(async () => {
    try {
      removeItem(LOCK_ON_STARTUP_KEY)
      setLockOnStartup(false)

      addToast(t('Lock on startup disabled.') as string, { timeout: 5000 })
    } catch (e) {
      addToast(t('Disabling lock on startup failed.') as string, { error: true })
    }
  }, [addToast, t, removeItem])

  const enableLockWhenInactive = useCallback(async () => {
    try {
      setItem(LOCK_WHEN_INACTIVE_KEY, 'true')
      setLockWhenInactive(true)

      addToast(t('Lock when inactive enabled.') as string, { timeout: 5000 })
    } catch (e) {
      addToast(t('Enabling lock when inactive failed.') as string, { error: true })
    }
  }, [addToast, t, setItem])
  const disableLockWhenInactive = useCallback(async () => {
    try {
      removeItem(LOCK_WHEN_INACTIVE_KEY)
      setLockWhenInactive(false)

      addToast(t('Lock when inactive is disabled.') as string, { timeout: 8000 })
    } catch (e) {
      addToast(t('Disabling lock when inactive failed.') as string, { error: true })
    }
  }, [addToast, t, removeItem])

  const setAppLockBiometrics = useCallback(async () => {
    try {
      const isAuthenticated = await authenticateWithLocalAuth()

      if (isAuthenticated) {
        setItem(IS_BIOMETRICS_UNLOCK_ACTIVE_KEY, 'true')
        setLockState(APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS)
      }

      return isAuthenticated
    } catch (e) {
      addToast(t('Enabling local auth failed.') as string, {
        error: true
      })
      return false
    }
  }, [addToast, t, authenticateWithLocalAuth, setItem])

  const removeAppLockBiometrics = useCallback(async () => {
    try {
      removeItem(IS_BIOMETRICS_UNLOCK_ACTIVE_KEY)
      setLockState(APP_LOCK_STATES.PASSCODE_ONLY)
    } catch (e) {
      addToast(t('Local auth got disabled, but this setting failed to save.') as string, {
        error: true
      })
    }
  }, [addToast, t, removeItem])

  const setAppLockPin = useCallback(
    async (code: string) => {
      try {
        await SecureStore.setItemAsync(SECURE_STORE_KEY_PASSCODE, code)

        setPasscode(code)

        if (lockState === APP_LOCK_STATES.UNLOCKED) {
          enableLockOnStartup()
        }

        setLockState(
          // Covers the case coming from a state with passcode already set
          lockState === APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS
            ? APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS
            : APP_LOCK_STATES.PASSCODE_ONLY
        )

        return true
      } catch (e) {
        return false
      }
    },
    [setPasscode, lockState, enableLockOnStartup]
  )
  const removeAppLock = useCallback(
    async (accountId?: string) => {
      // First, remove the local auth (if set), because without app lock
      // using local auth is not allowed.
      if (lockState === APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS) {
        await removeAppLockBiometrics()
      }

      // Disable lock on startup and when inactive, because without app lock
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
        addToast(t('App lock removed, but this setting failed to save.') as string, {
          error: true
        })
      }

      setPasscode(null)

      return setLockState(APP_LOCK_STATES.UNLOCKED)
    },
    [
      addToast,
      t,
      setLockState,
      removeAppLockBiometrics,
      lockOnStartup,
      lockWhenInactive,
      disableLockOnStartup,
      disableLockWhenInactive,
      lockState
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

  const triggerEnteringPasscode = useCallback(async () => {
    openBottomSheet()

    if (lockState === APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS) {
      // Await it on purpose, otherwise - it gets stuck on Android and the
      // local auth can't be triggered anymore until the app gets restarted...
      await triggerValidateLocalAuth()
    }
  }, [openBottomSheet, lockState, triggerValidateLocalAuth])

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
        autoFocus={lockState !== APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS}
        title={t('Unlock Ambire')}
        message={t('Enter your PIN.')}
        onFulfill={handleOnValidatePasscode}
        onValidateLocalAuth={triggerValidateLocalAuth}
        error={passcodeError}
        state={lockState}
        deviceSupportedAuthTypesLabel={deviceSupportedAuthTypesLabel}
        fallbackSupportedAuthTypesLabel={fallbackSupportedAuthTypesLabel}
      />
    </SafeAreaView>
  )

  return (
    <AppLockContext.Provider
      value={useMemo(
        () => ({
          lockState,
          isLoading,

          hasEnteredValidPasscode,
          triggerEnteringPasscode,
          resetValidPasscodeEntered,

          setAppLockPin,
          setAppLockBiometrics,
          removeAppLock,
          removeAppLockBiometrics,

          lockOnStartup,
          lockWhenInactive,
          enableLockOnStartup,
          disableLockOnStartup,
          enableLockWhenInactive,
          disableLockWhenInactive
        }),
        [
          lockState,
          isLoading,

          hasEnteredValidPasscode,
          triggerEnteringPasscode,
          resetValidPasscodeEntered,

          setAppLockPin,
          setAppLockBiometrics,
          removeAppLock,
          removeAppLockBiometrics,

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
          autoFocus={lockState !== APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS}
          onValidateLocalAuth={triggerValidateLocalAuth}
          error={passcodeError}
          state={lockState}
          deviceSupportedAuthTypesLabel={deviceSupportedAuthTypesLabel}
          fallbackSupportedAuthTypesLabel={fallbackSupportedAuthTypesLabel}
        />
      </BottomSheet>
    </AppLockContext.Provider>
  )
}

export { AppLockContext, AppLockProvider }
