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
  unlockVault: ({ password }: { password: string }) => Promise<any>
  lockVault: () => void
  isValidPassword: ({ password }: { password: string }) => Promise<boolean>
  addToVault: ({ addr, item }: { addr: string; item: VaultItem }) => Promise<any>
  removeFromVault: ({ addr }: { addr: string }) => Promise<any>
  isSignerAddedToVault: ({ addr }: { addr: string }) => Promise<boolean>
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
  signMsgQuickAcc: (props: {
    account: any
    network: any
    msgToSign: any
    dataV4: any
    isTypedData: any
    signature: any
  }) => Promise<any>
  signMsgExternalSigner: (props: {
    account: any
    network: any
    msgToSign: any
    dataV4: any
    isTypedData: any
  }) => Promise<any>
}

export const vaultContextDefaults: VaultContextReturnType = {
  vaultStatus: VAULT_STATUS.LOADING,
  createVault: () => {},
  resetVault: () => {},
  unlockVault: () => Promise.resolve(false),
  lockVault: () => {},
  isValidPassword: () => Promise.resolve(false),
  addToVault: () => Promise.resolve(false),
  removeFromVault: () => Promise.resolve(false),
  getSignerType: () => Promise.resolve(''),
  isSignerAddedToVault: () => Promise.resolve(false),
  signTxnQuckAcc: () => Promise.resolve(false),
  signTxnExternalSigner: () => Promise.resolve(false),
  signMsgQuickAcc: () => Promise.resolve(false),
  signMsgExternalSigner: () => Promise.resolve(false)
}
