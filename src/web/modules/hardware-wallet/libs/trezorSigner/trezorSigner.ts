import { Signature, toBeHex, Transaction } from 'ethers'

import {
  ExternalKey,
  ExternalSignerController,
  KeystoreSigner
} from '@ambire-common/interfaces/keystore'
import { addHexPrefix } from '@ambire-common/utils/addHexPrefix'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import { stripHexPrefix } from '@ambire-common/utils/stripHexPrefix'
import wait from '@ambire-common/utils/wait'
import transformTypedData from '@trezor/connect-plugin-ethereum'
import trezorConnect, { EthereumTransaction } from '@trezor/connect-web'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'

const DELAY_BETWEEN_POPUPS = 1000

/**
 * This is necessary to avoid popup collision between the unlock & sign Trezor popups.
 */
const delayBetweenPopupsIfNeeded = (status: 'JUST_UNLOCKED' | 'ALREADY_UNLOCKED') =>
  wait(status === 'JUST_UNLOCKED' ? DELAY_BETWEEN_POPUPS : 0)

/**
 * This is necessary to avoid popup collision between signing multiple times in
 * a row or between signing a message and then a raw transaction.
 */
const delayBetweenStarting = () => wait(1000)

class TrezorSigner implements KeystoreSigner {
  key: ExternalKey

  controller: TrezorController | null = null

  constructor(_key: ExternalKey) {
    this.key = _key
  }

  init(externalDeviceController?: ExternalSignerController) {
    if (!externalDeviceController) {
      throw new Error('trezorSigner: externalDeviceController not initialized')
    }

    this.controller = externalDeviceController
  }

  signRawTransaction: KeystoreSigner['signRawTransaction'] = async (txnRequest) => {
    if (!this.controller) {
      throw new Error('trezorSigner: trezorController not initialized')
    }

    if (typeof txnRequest.value === 'undefined') {
      throw new Error('trezorSigner: missing value in transaction request')
    }

    await delayBetweenStarting()
    const status = await this.controller.unlock()
    await delayBetweenPopupsIfNeeded(status)

    // Note: Trezor auto-detects the transaction `type`, based on the txn params
    const unsignedTxn: EthereumTransaction = {
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
      transaction: unsignedTxn
    })

    if (!res.success) {
      throw new Error(res.payload?.error || 'trezorSigner: singing failed for unknown reason')
    }

    try {
      const signature = Signature.from({
        r: res.payload.r,
        s: res.payload.s,
        v: Signature.getNormalizedV(res.payload.v)
      })
      const signedSerializedTxn = Transaction.from({
        ...unsignedTxn,
        signature,
        // The nonce type of the normalized `unsignedTransaction` compatible
        // with Trezor  mismatches the EthersJS supported type, so fallback to
        // the nonce incoming from the `txnRequest` param
        nonce: txnRequest.nonce,
        // TODO: Temporary use the legacy transaction mode, because:
        //   1) Trezor doesn't support EIP-2930 yet (type `1`).
        //   2) Ambire extension doesn't support EIP-1559 yet (type: `2`)
        type: 0
      }).serialized

      return signedSerializedTxn
    } catch (error: any) {
      throw new Error(error?.message || 'trezorSigner: singing failed for unknown reason')
    }
  }

  signTypedData: KeystoreSigner['signTypedData'] = async ({
    domain,
    types,
    message,
    primaryType
  }) => {
    if (!this.controller) {
      throw new Error(
        'Something went wrong with triggering the sign message mechanism. Please try again or contact support if the problem persists.'
      )
    }

    const dataWithHashes = transformTypedData({ domain, types, message, primaryType }, true)

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { domain_separator_hash, message_hash } = dataWithHashes

    await delayBetweenStarting()
    const status = await this.controller.unlock()
    await delayBetweenPopupsIfNeeded(status)

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

  signMessage: KeystoreSigner['signMessage'] = async (hex) => {
    if (!this.controller) {
      throw new Error(
        'Something went wrong with triggering the sign message mechanism. Please try again or contact support if the problem persists.'
      )
    }

    await delayBetweenStarting()
    const status = await this.controller.unlock()
    await delayBetweenPopupsIfNeeded(status)

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

    return addHexPrefix(res.payload.signature)
  }
}

export default TrezorSigner
