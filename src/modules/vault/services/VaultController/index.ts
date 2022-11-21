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

  // create a new empty vault encrypted with password
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
      } else {
        reject()
      }
    })
  }

  // password = new password that will lock the app
  // reset password and remove the added accounts/reset vault
  async resetVault({ password }: { password: string }) {
    return new Promise((resolve, reject) => {
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
    })
  }

  // change password but keep the added accounts
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
