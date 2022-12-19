export interface UseVaultBiometricsReturnType {
  biometricsEnabled: boolean
  addKeystorePasswordToDeviceSecureStore: (password: string) => Promise<boolean>
  removeKeystorePasswordFromDeviceSecureStore: () => Promise<boolean>
  getKeystorePassword: () => Promise<string | null>
}

export const useVaultBiometricsDefaults: UseVaultBiometricsReturnType = {
  biometricsEnabled: false,
  addKeystorePasswordToDeviceSecureStore: () => Promise.resolve(false),
  removeKeystorePasswordFromDeviceSecureStore: () => Promise.resolve(false),
  getKeystorePassword: () => Promise.resolve(null)
}
