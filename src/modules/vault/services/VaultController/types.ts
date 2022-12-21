// eslint-disable-next-line @typescript-eslint/naming-convention
export enum SIGNER_TYPES {
  quickAcc = 'quickAcc',
  external = 'external',
  hardware = 'hardware'
}

export type VaultItem = {
  // signer/private key
  signer: string
  password?: string
  type: keyof typeof SIGNER_TYPES
}

export type Vault = {
  // public signer addr
  [key: string]: VaultItem
} | null
