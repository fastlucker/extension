export interface BiometricsSignContextReturnType {
  biometricsEnabled: boolean
  addKeystorePasswordToDeviceSecureStore: (password: string) => Promise<boolean>
  removeKeystorePasswordFromDeviceSecureStore: () => Promise<boolean>
  getKeystorePassword: () => Promise<string | null>
}

export const biometricsSignContextDefaults: BiometricsSignContextReturnType = {
  biometricsEnabled: false,
  addKeystorePasswordToDeviceSecureStore: () => Promise.resolve(false),
  removeKeystorePasswordFromDeviceSecureStore: () => Promise.resolve(false),
  getKeystorePassword: () => Promise.resolve(null)
}
