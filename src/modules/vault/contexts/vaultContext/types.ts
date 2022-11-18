import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'

export interface VaultContextReturnType {
  vaultStatus: VAULT_STATUS
  createVault: ({
    password,
    confirmPassword
  }: {
    password: string
    confirmPassword: string
  }) => void
  unlockVault: ({ password }: { password: string }) => void
}

export const vaultContextDefaults: VaultContextReturnType = {
  vaultStatus: VAULT_STATUS.LOADING,
  createVault: () => {},
  unlockVault: () => {}
}
