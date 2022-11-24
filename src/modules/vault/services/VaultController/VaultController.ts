import { Bundle } from 'adex-protocol-eth/js'
import { signMessage, signMessage712 } from 'adex-protocol-eth/js/Bundle'
import { getProvider } from 'ambire-common/src/services/provider'
import { Wallet } from 'ethers'
import { arrayify, isHexString, toUtf8Bytes } from 'ethers/lib/utils'

import { verifyMessage } from '@ambire/signature-validator'
import CONFIG from '@config/env'
import { decrypt, encrypt } from '@modules/common/services/passworder'
import { sendNoRelayer } from '@modules/common/services/sendNoRelayer'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import { getStore, setItem } from '@web/functions/storage'

import { Vault, VaultItem } from './types'

const relayerURL = CONFIG.RELAYER_URL

function getMessageAsBytes(msg: string) {
  // Transforming human message / hex string to bytes
  if (!isHexString(msg)) {
    return toUtf8Bytes(msg)
  }
  return arrayify(msg)
}
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
            resolve(VAULT_STATUS.UNLOCKED)
          })
          .catch((err) => {
            reject(new Error(err))
          })
      } else {
        reject(new Error('Vault already initialized'))
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
          resolve(VAULT_STATUS.UNLOCKED)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  }

  // change password but keep the added accounts
  async changeVaultPassword({ password, newPassword }: { password: string; newPassword: string }) {
    if (!this.#password) throw new Error('Unauthenticated')

    return new Promise((resolve, reject) => {
      if (password === this.#password) {
        encrypt(newPassword, JSON.stringify({}))
          .then((blob: string) => {
            setItem('vault', blob)
            this.#password = newPassword
            resolve(VAULT_STATUS.UNLOCKED)
          })
          .catch((err) => {
            reject(new Error(err))
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
          resolve(VAULT_STATUS.UNLOCKED)
        })
        .catch(() => {
          reject(new Error('Invalid password'))
        })
    })
  }

  isValidPassword({ password }: { password: string }) {
    return !!this.#password && password === this.#password
  }

  async addToVault({ addr, item }: { addr: string; item: VaultItem }) {
    if (!this.#password) throw new Error('Unauthenticated')

    const updatedVault = {
      ...this.#memVault,
      [addr]: item
    }

    return new Promise((resolve, reject) => {
      encrypt(this.#password as string, JSON.stringify(updatedVault))
        .then((blob: string) => {
          setItem('vault', blob)
          this.#memVault = updatedVault
          resolve(true)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  }

  async removeFromVault({ addr }: { addr: string }) {
    if (!this.#password) throw new Error('Unauthenticated')

    const updatedVault = {
      ...this.#memVault
    }

    delete updatedVault[addr]

    return new Promise((resolve, reject) => {
      encrypt(this.#password as string, JSON.stringify(updatedVault))
        .then((blob: string) => {
          setItem('vault', blob)
          this.#memVault = updatedVault
          resolve(true)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  }

  async isSignerAddedToVault({ addr }: { addr: string }) {
    if (!this.#memVault) throw new Error('Vault not initialized')
    const vaultItem = this.#memVault[addr]

    return !!vaultItem
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
    const vaultItem = this.#memVault[signer.address || signer.one]

    if (!vaultItem) throw new Error('Signer not found')

    if (!bundle.recoveryMode) {
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
    const vaultItem = this.#memVault[signer.address || signer.one]

    if (!vaultItem) throw new Error('Signer not found')

    const wallet = new Wallet(vaultItem.signer)

    if (relayerURL) {
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

  async signMsgExternalSigner({
    account,
    network,
    toSign,
    dataV4,
    isTypedData
  }: {
    account: any
    network: any
    toSign: any
    dataV4: any
    isTypedData: any
  }) {
    if (!this.#memVault) throw new Error('Vault not initialized')

    const vaultItem = this.#memVault[account.signer?.address]

    if (!vaultItem) throw new Error('Signer not found')

    const wallet = new Wallet(vaultItem.signer)

    const sig = await (toSign.type === 'eth_signTypedData_v4' || toSign.type === 'eth_signTypedData'
      ? signMessage712(
          wallet,
          account.id,
          account.signer,
          dataV4.domain,
          dataV4.types,
          dataV4.message
        )
      : signMessage(wallet, account.id, account.signer, getMessageAsBytes(toSign.txn)))

    const provider = getProvider(network.id)

    // eslint-disable-next-line @typescript-eslint/return-await
    await verifyMessage({
      provider,
      signer: account.id,
      message: isTypedData ? null : getMessageAsBytes(toSign.txn),
      typedData: isTypedData ? dataV4 : null,
      signature: sig
    })

    return sig
  }
}
