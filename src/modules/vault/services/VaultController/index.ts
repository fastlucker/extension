import { decrypt, encrypt } from '@modules/common/services/passworder'
import { getStore, setItem } from '@web/functions/storage'

type Vault = {
  [key: string]: {
    // encrypted signer
    signer: string
    type: 'quickAcc' | 'external'
  }
} | null

export default class VaultController {
  #password: string | null

  #memVault: Vault

  constructor() {
    this.#password = null
    this.#memVault = null
  }

  isVaultUnlocked() {
    return !!this.#password
  }

  async createVault({ password }: { password: string }) {
    const store: any = (await getStore(['vault'])) || {}

    return new Promise((resolve, reject) => {
      if (!store.vault) {
        encrypt(password, JSON.stringify({}))
          .then((blob: string) => {
            setItem('vault', blob)
            this.#password = password
            this.#memVault = {}
            resolve(true)
          })
          .catch(() => {
            reject()
          })
        reject()
      } else {
        reject()
      }
    })
  }

  async changeVaultPassword({ password, newPassword }: { password: string; newPassword: string }) {
    return new Promise((resolve, reject) => {
      if (password === this.#password) {
        encrypt(newPassword, JSON.stringify({}))
          .then((blob: string) => {
            setItem('vault', blob)
            this.#password = newPassword
            resolve(true)
          })
          .catch(() => {
            reject()
          })
      } else {
        reject('wrong password')
      }
    })
  }

  async unlockVault({ password }: { password: string }) {
    const store: any = (await getStore(['vault'])) || {}

    return new Promise((resolve, reject) => {
      decrypt(password, store.vault)
        .then((vault: any) => {
          this.#password = password
          this.#memVault = JSON.parse(vault)
          resolve(true)
        })
        .catch(() => {
          reject()
        })
    })
  }
}
