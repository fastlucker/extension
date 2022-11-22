import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import { VaultItem } from '@modules/vault/services/VaultController/types'

export interface VaultContextReturnType {
  vaultStatus: VAULT_STATUS
  createVault: ({
    password,
    confirmPassword
  }: {
    password: string
    confirmPassword: string
  }) => void
  resetVault: ({ password, confirmPassword }: { password: string; confirmPassword: string }) => void
  unlockVault: ({ password }: { password: string }) => void
  isValidPassword: ({ password }: { password: string }) => Promise<boolean>
  addToVault: ({ addr, item }: { addr: string; item: VaultItem }) => Promise<any>
  removeFromVault: ({ addr }: { addr: string }) => Promise<any>
  getSignerType: ({ addr }: { addr: string }) => Promise<string>
  signTxnQuckAcc: (props: {
    finalBundle: any
    primaryKeyBackup: string
    signature: any
  }) => Promise<any>
  signTxnExternalSigner: (props: {
    finalBundle: any
    estimation: any
    feeSpeed: any
    account: any
    network: any
  }) => Promise<any>
}

export const vaultContextDefaults: VaultContextReturnType = {
  vaultStatus: VAULT_STATUS.LOADING,
  createVault: () => {},
  resetVault: () => {},
  unlockVault: () => {},
  isValidPassword: () => Promise.resolve(false),
  addToVault: () => Promise.resolve(false),
  removeFromVault: () => Promise.resolve(false),
  getSignerType: () => Promise.resolve(''),
  signTxnQuckAcc: () => Promise.resolve(false),
  signTxnExternalSigner: () => Promise.resolve(false)
}
