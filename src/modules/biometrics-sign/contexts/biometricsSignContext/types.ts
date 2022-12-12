export interface BiometricsSignContextReturnType {
  biometricsEnabled: boolean
  addKeystorePasswordToDeviceSecureStore: (password: string) => Promise<boolean>
  removeKeystorePasswordFromDeviceSecureStore: () => Promise<boolean>
  getVaultPassword: () => Promise<string | null>
}

export const biometricsSignContextDefaults: BiometricsSignContextReturnType = {
  biometricsEnabled: false,
  addKeystorePasswordToDeviceSecureStore: () => Promise.resolve(false),
  removeKeystorePasswordFromDeviceSecureStore: () => Promise.resolve(false),
  getVaultPassword: () => Promise.resolve(null)
}
