export interface VaultContextReturnType {
  createPassword: ({
    password,
    confirmPassword
  }: {
    password: string
    confirmPassword: string
  }) => void
}

export const vaultContextDefaults: VaultContextReturnType = {
  createPassword: () => {}
}
