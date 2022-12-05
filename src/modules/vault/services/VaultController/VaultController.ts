import { Bundle } from 'adex-protocol-eth/js'
import { signMessage, signMessage712 } from 'adex-protocol-eth/js/Bundle'
import { getProvider } from 'ambire-common/src/services/provider'
import { Wallet } from 'ethers'
import { arrayify, isHexString, toUtf8Bytes } from 'ethers/lib/utils'

import { verifyMessage } from '@ambire/signature-validator'
import CONFIG from '@config/env'
import { StorageController } from '@modules/common/contexts/storageContext/storageController'
import { decrypt, encrypt } from '@modules/common/services/passworder'
import { sendNoRelayer } from '@modules/common/services/sendNoRelayer'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'

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

  storageController: StorageController

  constructor(storageController: StorageController) {
    this.#password = null
    this.#memVault = null

    this.storageController = storageController
  }

  isVaultUnlocked() {
    return !!this.#password
  }

  // create a new empty vault encrypted with password
  createVault({ password }: { password: string }) {
    const vault = this.storageController.getItem('vault')

    return new Promise((resolve, reject) => {
      if (!vault) {
        encrypt(password, JSON.stringify({}))
          .then((blob: string) => {
            this.storageController.setItem('vault', blob)
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
  resetVault({ password }: { password: string }) {
    return new Promise((resolve, reject) => {
      encrypt(password, JSON.stringify({}))
        .then((blob: string) => {
          this.storageController.setItem('vault', blob)
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
            this.storageController.setItem('vault', blob)
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

  unlockVault({ password }: { password: string }) {
    const vault = this.storageController.getItem('vault')

    return new Promise((resolve, reject) => {
      decrypt(password, vault)
        .then((_vault: any) => {
          this.#password = password
          this.#memVault = JSON.parse(_vault)
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

  addToVault({ addr, item }: { addr: string; item: VaultItem }) {
    if (!this.#password || this.#memVault === null) throw new Error('Unauthenticated')

    const updatedVault = this.#memVault || {}
    updatedVault[addr] = item

    return new Promise((resolve, reject) => {
      encrypt(this.#password as string, JSON.stringify(updatedVault))
        .then((blob: string) => {
          this.storageController.setItem('vault', blob)
          this.#memVault = updatedVault
          resolve(true)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  }

  removeFromVault({ addr }: { addr: string }) {
    if (!this.#password || this.#memVault === null) throw new Error('Unauthenticated')

    const updatedVault = this.#memVault || {}

    delete updatedVault[addr]

    return new Promise((resolve, reject) => {
      encrypt(this.#password as string, JSON.stringify(updatedVault))
        .then((blob: string) => {
          this.storageController.setItem('vault', blob)
          this.#memVault = updatedVault
          resolve(true)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  }

  isSignerAddedToVault({ addr }: { addr: string }) {
    if (!this.#memVault) throw new Error('Vault not initialized')
    const vaultItem = this.#memVault[addr]

    return !!vaultItem
  }

  getSignerType({ addr }: { addr: string }) {
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

  async signMsgQuickAcc({
    account,
    network,
    msgToSign,
    dataV4,
    isTypedData,
    signature
  }: {
    account: any
    network: any
    msgToSign: any
    dataV4: any
    isTypedData: any
    signature: any
  }) {
    if (!this.#memVault) throw new Error('Vault not initialized')

    const vaultItem = this.#memVault[account?.signer?.address || account?.signer?.one]

    if (!vaultItem) throw new Error('Signer not found')

    const wallet = await Wallet.fromEncryptedJson(
      JSON.parse(account?.primaryKeyBackup),
      vaultItem.password as string
    )

    const sig = await (isTypedData
      ? signMessage712(
          wallet,
          account.id,
          account.signer,
          dataV4.domain,
          dataV4.types,
          dataV4.message,
          signature
        )
      : signMessage(
          wallet,
          account.id,
          account.signer,
          getMessageAsBytes(msgToSign.txn),
          signature
        ))

    const provider = getProvider(network.id)

    // eslint-disable-next-line @typescript-eslint/return-await
    const isValidSig = await verifyMessage({
      provider,
      signer: account.id,
      message: isTypedData ? null : getMessageAsBytes(msgToSign.txn),
      typedData: isTypedData ? dataV4 : null,
      signature: sig
    })

    return { sig, isValidSig }
  }

  async signMsgExternalSigner({
    account,
    network,
    msgToSign,
    dataV4,
    isTypedData
  }: {
    account: any
    network: any
    msgToSign: any
    dataV4: any
    isTypedData: any
  }) {
    if (!this.#memVault) throw new Error('Vault not initialized')

    const vaultItem = this.#memVault[account.signer?.address]

    if (!vaultItem) throw new Error('Signer not found')

    const wallet = new Wallet(vaultItem.signer)

    const sig = await (isTypedData
      ? signMessage712(
          wallet,
          account.id,
          account.signer,
          dataV4.domain,
          dataV4.types,
          dataV4.message
        )
      : signMessage(wallet, account.id, account.signer, getMessageAsBytes(msgToSign.txn)))

    const provider = getProvider(network.id)

    // eslint-disable-next-line @typescript-eslint/return-await
    const isValidSig = await verifyMessage({
      provider,
      signer: account.id,
      message: isTypedData ? null : getMessageAsBytes(msgToSign.txn),
      typedData: isTypedData ? dataV4 : null,
      signature: sig
    })

    return { sig, isValidSig }
  }
}
