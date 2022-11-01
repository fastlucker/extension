import { DEVICE_SECURITY_LEVEL, DEVICE_SUPPORTED_AUTH_TYPES } from './constants'

export interface BiometricsContextReturnType {
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL
  deviceSupportedAuthTypes: DEVICE_SUPPORTED_AUTH_TYPES[]
  // Determine what kinds of authentications are available on the device.
  deviceSupportedAuthTypesLabel: string
  fallbackSupportedAuthTypesLabel: string
  isLoading: boolean
  // Determines whether a face or fingerprint scanner is available on the device
  isLocalAuthSupported: null | boolean
  // Be aware that the Promise should always return something for `setAppLockBiometrics`
  // and `isValidLocalAuth`, because Promise<void> makes the local auth to hang
  // on Android and always return `false`, without rejecting the promise,
  // which leads to strange results.
  requestLocalAuth: () => Promise<boolean>
}

export const biometricsContextDefaults: BiometricsContextReturnType = {
  deviceSecurityLevel: DEVICE_SECURITY_LEVEL.NONE,
  deviceSupportedAuthTypes: [],
  deviceSupportedAuthTypesLabel: '',
  fallbackSupportedAuthTypesLabel: '',
  isLoading: true,
  isLocalAuthSupported: null,
  requestLocalAuth: () => Promise.resolve(false)
}
