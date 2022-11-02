import { APP_LOCK_STATES } from './constants'

export interface AppLockContextReturnType {
  state: APP_LOCK_STATES
  isLoading: boolean

  isValidPasscode: (code: string) => boolean
  triggerEnteringPasscode: () => void
  resetValidPasscodeEntered: () => void
  hasEnteredValidPasscode: boolean | null

  setAppLockPin: (code: string) => Promise<boolean>
  // Be aware that the Promise should always return something for `setAppLockBiometrics`
  // and `isValidLocalAuth`, because Promise<void> makes the local auth to hang
  // on Android and always return `false`, without rejecting the promise,
  // which leads to strange results.
  setAppLockBiometrics: () => Promise<boolean>
  removeAppLock: (accountId?: string) => Promise<void>
  removeAppLockBiometrics: () => void

  lockOnStartup: boolean
  lockWhenInactive: boolean
  enableLockOnStartup: () => void
  disableLockOnStartup: () => void
  enableLockWhenInactive: () => void
  disableLockWhenInactive: () => void
}

export const appLockContextDefaults: AppLockContextReturnType = {
  state: APP_LOCK_STATES.UNLOCKED,
  isLoading: true,
  isValidPasscode: () => false,
  triggerEnteringPasscode: () => {},
  resetValidPasscodeEntered: () => {},
  hasEnteredValidPasscode: null,
  setAppLockPin: () => Promise.resolve(false),
  setAppLockBiometrics: () => Promise.resolve(false),
  removeAppLock: () => Promise.resolve(),
  removeAppLockBiometrics: () => {},
  enableLockOnStartup: () => {},
  disableLockOnStartup: () => {},
  enableLockWhenInactive: () => {},
  disableLockWhenInactive: () => {},
  lockOnStartup: false,
  lockWhenInactive: false
}
