import { Bundle } from 'adex-protocol-eth/js'
import { getProvider } from 'ambire-common/src/services/provider'
import { Wallet } from 'ethers'

import CONFIG from '@config/env'
import { decrypt, encrypt } from '@modules/common/services/passworder'
import { sendNoRelayer } from '@modules/common/services/sendNoRelayer'
import { getStore, setItem } from '@web/functions/storage'

import { Vault, VaultItem } from './types'

const relayerURL = CONFIG.RELAYER_URL

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

  // forgotten password flow
  // password = the new password that will lock the app
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
        reject(new Error('Invalid password'))
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

  isValidPassword({ password }: { password: string }) {
    return !!this.#password && password === this.#password
  }

  async addToVault({ addr, item }: { addr: string; item: VaultItem }) {
    const updatedVault = {
      ...this.#memVault,
      [addr]: item
    }

    return new Promise((resolve, reject) => {
      if (this.#password) {
        encrypt(this.#password as string, JSON.stringify(updatedVault))
          .then((blob: string) => {
            setItem('vault', blob)
            this.#memVault = updatedVault
            resolve(true)
          })
          .catch(() => {
            reject()
          })
      }
    })
  }

  async removeFromVault({ addr }: { addr: string }) {
    const updatedVault = {
      ...this.#memVault
    }

    delete updatedVault[addr]

    return new Promise((resolve, reject) => {
      if (this.#password) {
        encrypt(this.#password as string, JSON.stringify(updatedVault))
          .then((blob: string) => {
            setItem('vault', blob)
            this.#memVault = updatedVault
            resolve(true)
          })
          .catch(() => {
            reject()
          })
      }
    })
  }

  async getSignerType({ addr }: { addr: string }) {
    if (!this.#memVault) throw new Error('Vault not initialized')
    const vaultItem = this.#memVault[addr]

    if (!vaultItem) throw new Error('Signer not found')

    return vaultItem.type
  }

  async signTxnQuckAcc({
    finalBundle,
    primaryKeyBackup,
    signature
  }: {
    finalBundle: any
    primaryKeyBackup: string
    signature: any
  }) {
    if (!this.#memVault) throw new Error('Vault not initialized')
    const bundle = new Bundle(finalBundle)
    const signer = bundle.signer
    const vaultItem = this.#memVault[signer.address]

    if (!vaultItem) throw new Error('Signer not found')

    if (!bundle.recoveryMode) {
      // Make sure we let React re-render without blocking (decrypting and signing will block)
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 0))
      const wallet = await Wallet.fromEncryptedJson(
        JSON.parse(primaryKeyBackup),
        vaultItem.password as string
      )
      await bundle.sign(wallet)
    } else {
      // set both .signature and .signatureTwo to the same value: the secondary signature
      // this will trigger a timelocked txn
      bundle.signature = signature
    }
    bundle.signatureTwo = signature
    // eslint-disable-next-line @typescript-eslint/return-await
    return await bundle.submit({ relayerURL, fetch })
  }

  async signTxnExternalSigner({
    finalBundle,
    estimation,
    feeSpeed,
    account,
    network
  }: {
    finalBundle: any
    estimation: any
    feeSpeed: any
    account: any
    network: any
  }) {
    if (!this.#memVault) throw new Error('Vault not initialized')

    const provider = getProvider(network.id)
    const bundle = new Bundle(finalBundle)

    const signer = bundle.signer
    const vaultItem = this.#memVault[signer.address]

    if (!vaultItem) throw new Error('Signer not found')

    const wallet = new Wallet(vaultItem.signer)

    if (relayerURL) {
      // Temporary way of debugging the fee cost
      // const initialLimit = finalBundle.gasLimit - getFeePaymentConsequences(estimation.selectedFeeToken, estimation).addedGas
      // finalBundle.estimate({ relayerURL, fetch }).then(estimation => console.log('fee costs: ', estimation.gasLimit - initialLimit), estimation.selectedFeeToken).catch(console.error)
      await bundle.sign(wallet)
      // eslint-disable-next-line @typescript-eslint/return-await
      return await bundle.submit({ relayerURL, fetch })
    }
    // eslint-disable-next-line @typescript-eslint/return-await
    return await sendNoRelayer({
      finalBundle: bundle,
      account,
      network,
      wallet,
      estimation,
      feeSpeed,
      provider
    })
  }
}
