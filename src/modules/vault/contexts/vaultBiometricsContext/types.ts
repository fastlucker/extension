export interface VaultBiometricsContextReturnType {
  biometricsEnabled: boolean
  addKeystorePasswordToDeviceSecureStore: (password: string) => Promise<boolean>
  removeKeystorePasswordFromDeviceSecureStore: () => Promise<boolean>
  getKeystorePassword: () => Promise<string | null>
}

export const vaultBiometricsContextDefaults: VaultBiometricsContextReturnType = {
  biometricsEnabled: false,
  addKeystorePasswordToDeviceSecureStore: () => Promise.resolve(false),
  removeKeystorePasswordFromDeviceSecureStore: () => Promise.resolve(false),
  getKeystorePassword: () => Promise.resolve(null)
}
