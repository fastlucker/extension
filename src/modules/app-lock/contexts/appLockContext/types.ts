import { DEVICE_SECURITY_LEVEL, DEVICE_SUPPORTED_AUTH_TYPES, PASSCODE_STATES } from './constants'

export interface AppLockContextReturnType {
  state: PASSCODE_STATES
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL
  deviceSupportedAuthTypes: DEVICE_SUPPORTED_AUTH_TYPES[]
  deviceSupportedAuthTypesLabel: string
  fallbackSupportedAuthTypesLabel: string
  setAppLockPin: (code: string) => Promise<boolean>
  removeAppLock: (accountId?: string) => Promise<void>
  isLoading: boolean
  isValidPasscode: (code: string) => boolean
  isLocalAuthSupported: null | boolean
  // Be aware that the Promise should always return something for `setAppLockBiometrics`
  // and `isValidLocalAuth`, because Promise<void> makes the local auth to hang
  // on Android and always return `false`, without rejecting the promise,
  // which leads to strange results.
  setAppLockBiometrics: () => Promise<boolean>
  removeAppLockBiometrics: () => void
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

export const appLockContextDefaults: AppLockContextReturnType = {
  state: PASSCODE_STATES.NO_PASSCODE,
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL.NONE,
  deviceSupportedAuthTypes: [],
  deviceSupportedAuthTypesLabel: '',
  fallbackSupportedAuthTypesLabel: '',
  setAppLockPin: () => Promise.resolve(false),
  removeAppLock: () => Promise.resolve(),
  isLoading: true,
  isValidPasscode: () => false,
  isLocalAuthSupported: null,
  setAppLockBiometrics: () => Promise.resolve(false),
  removeAppLockBiometrics: () => {},
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
