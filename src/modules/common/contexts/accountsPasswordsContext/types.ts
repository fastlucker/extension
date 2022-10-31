export interface AccountsPasswordsContextReturnType {
  isLoading: boolean
  selectedAccHasPassword: boolean
  addSelectedAccPassword: (password: string) => Promise<boolean>
  removeSelectedAccPassword: (accountId?: string) => Promise<boolean>
  getSelectedAccPassword: () => Promise<string>
}

export const accountsPasswordsContextDefaults: AccountsPasswordsContextReturnType = {
  isLoading: true,
  selectedAccHasPassword: false,
  addSelectedAccPassword: () => Promise.resolve(false),
  removeSelectedAccPassword: () => Promise.resolve(false),
  getSelectedAccPassword: () => Promise.resolve('')
}
