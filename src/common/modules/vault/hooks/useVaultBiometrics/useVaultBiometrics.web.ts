import { useVaultBiometricsDefaults, UseVaultBiometricsReturnType } from './types'

// This hook is needed for the mobile app only. For web, fallback to defaults.
const useVaultBiometrics = (): UseVaultBiometricsReturnType => useVaultBiometricsDefaults

export default useVaultBiometrics
