export interface BiometricsSignContextReturnType {
  isLoading: boolean
  selectedAccHasPassword: boolean
  addSelectedAccPassword: (password: string) => Promise<boolean>
  removeSelectedAccPassword: (accountId?: string) => Promise<boolean>
  getSelectedAccPassword: () => Promise<string | null>
}

export const biometricsSignContextDefaults: BiometricsSignContextReturnType = {
  isLoading: true,
  selectedAccHasPassword: false,
  addSelectedAccPassword: () => Promise.resolve(false),
  removeSelectedAccPassword: () => Promise.resolve(false),
  getSelectedAccPassword: () => Promise.resolve(null)
}
