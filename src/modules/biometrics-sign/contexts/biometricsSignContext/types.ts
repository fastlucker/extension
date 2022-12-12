export interface BiometricsSignContextReturnType {
  biometricsEnabled: boolean
  addVaultPasswordToDeviceSecureStore: (password: string) => Promise<boolean>
  removeVaultPasswordFromDeviceSecureStore: () => Promise<boolean>
  getVaultPassword: () => Promise<string | null>
}

export const biometricsSignContextDefaults: BiometricsSignContextReturnType = {
  biometricsEnabled: false,
  addVaultPasswordToDeviceSecureStore: () => Promise.resolve(false),
  removeVaultPasswordFromDeviceSecureStore: () => Promise.resolve(false),
  getVaultPassword: () => Promise.resolve(null)
}
