import { stripHexPrefix } from 'ethereumjs-util'
import { Signature, toBeHex, Transaction } from 'ethers'

import { ExternalKey, KeystoreSigner } from '@ambire-common/interfaces/keystore'
import { TypedMessage } from '@ambire-common/interfaces/userRequest'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import { delayPromise } from '@common/utils/promises'
import transformTypedData from '@trezor/connect-plugin-ethereum'
import trezorConnect, { EthereumTransaction } from '@trezor/connect-web'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'

const DELAY_BETWEEN_POPUPS = 1000

class TrezorSigner implements KeystoreSigner {
  key: ExternalKey

  controller: TrezorController | null = null

  constructor(_key: ExternalKey) {
    this.key = _key
  }

  init(_controller: any) {
    this.controller = _controller
  }

  signRawTransaction: KeystoreSigner['signRawTransaction'] = async (txnRequest) => {
    if (!this.controller) {
      throw new Error('trezorSigner: trezorController not initialized')
    }

    if (typeof txnRequest.value === 'undefined') {
      throw new Error('trezorSigner: missing value in transaction request')
    }

    const status = await this.controller.unlock()
    await delayPromise(status === 'just unlocked' ? DELAY_BETWEEN_POPUPS : 0)

    const unsignedTransaction: EthereumTransaction = {
      ...txnRequest,
      // The incoming `txnRequest` param types mismatch the Trezor expected ones,
      // so normalize the types before passing them to the Trezor API
      value: toBeHex(txnRequest.value),
      gasLimit: toBeHex(txnRequest.gasLimit),
      gasPrice: toBeHex(txnRequest.gasPrice),
      nonce: toBeHex(txnRequest.nonce),
      chainId: Number(txnRequest.chainId) // assuming the value is a BigInt within the safe integer range
    }

    const res = await trezorConnect.ethereumSignTransaction({
      path: getHdPathFromTemplate(this.key.meta.hdPathTemplate, this.key.meta.index),
      transaction: unsignedTransaction
    })

    if (!res.success) {
      throw new Error(res.payload?.error || 'trezorSigner: unknown error')
    }

    try {
      const signature = Signature.from({
        r: res.payload.r,
        s: res.payload.s,
        v: Signature.getNormalizedV(res.payload.v)
      })
      const serializedSignedTxn = Transaction.from({
        ...unsignedTransaction,
        type: 0, // TODO: use `1` to make EIP-2930 transaction instead
        nonce: txnRequest.nonce,
        signature
      }).serialized

      return serializedSignedTxn
    } catch (error: any) {
      throw new Error(error?.message || 'trezorSigner: unknown error')
    }
  }

  async signTypedData({ domain, types, message, primaryType }: TypedMessage) {
    if (!this.controller) {
      throw new Error(
        'Something went wrong with triggering the sign message mechanism. Please try again or contact support if the problem persists.'
      )
    }

    const dataWithHashes = transformTypedData({ domain, types, message, primaryType }, true)

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { domain_separator_hash, message_hash } = dataWithHashes

    // This is necessary to avoid popup collision
    // between the unlock & sign trezor popups
    const status = await this.controller.unlock()
    await delayPromise(status === 'just unlocked' ? DELAY_BETWEEN_POPUPS : 0)

    const res = await trezorConnect.ethereumSignTypedData({
      path: getHdPathFromTemplate(this.key.meta.hdPathTemplate, this.key.meta.index),
      data: {
        types,
        message,
        domain,
        primaryType
      },
      metamask_v4_compat: true,
      // Trezor 1 only supports blindly signing hashes
      domain_separator_hash,
      message_hash
    } as any)

    if (!res.success) {
      throw new Error(
        res.payload.error ||
          'Something went wrong when signing the typed data message. Please try again or contact support if the problem persists.'
      )
    }

    return res.payload.signature
  }

  async signMessage(hex: string) {
    if (!this.controller) {
      throw new Error(
        'Something went wrong with triggering the sign message mechanism. Please try again or contact support if the problem persists.'
      )
    }

    const status = await this.controller.unlock()
    await delayPromise(status === 'just unlocked' ? DELAY_BETWEEN_POPUPS : 0)

    const res = await trezorConnect.ethereumSignMessage({
      path: getHdPathFromTemplate(this.key.meta.hdPathTemplate, this.key.meta.index),
      message: stripHexPrefix(hex),
      hex: true
    })

    if (!res.success) {
      throw new Error(
        res.payload.error ||
          'Something went wrong when signing the message. Please try again or contact support if the problem persists.'
      )
    }

    return `0x${res.payload.signature}`
  }
}

export default TrezorSigner
