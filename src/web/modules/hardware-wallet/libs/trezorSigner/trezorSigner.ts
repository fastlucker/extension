import { stripHexPrefix } from 'ethereumjs-util'
import { Transaction } from 'ethers'

import { ExternalKey, KeystoreSigner } from '@ambire-common/interfaces/keystore'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { TypedMessage } from '@ambire-common/interfaces/userRequest'
import { Call, GasFeePayment } from '@ambire-common/libs/accountOp/accountOp'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import { delayPromise } from '@common/utils/promises'
import transformTypedData from '@trezor/connect-plugin-ethereum'
import trezorConnect, { EthereumTransaction, EthereumTransactionEIP1559 } from '@trezor/connect-web'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'

const DELAY_BETWEEN_POPUPS = 1000
const EIP_155_CONSTANT = 35

class TrezorSigner implements KeystoreSigner {
  key: ExternalKey

  controller: TrezorController | null = null

  constructor(_key: ExternalKey) {
    this.key = _key
  }

  init(_controller: any) {
    this.controller = _controller
  }

  async signRawTransaction(txnRequest: {
    to: Call['to']
    value: Call['value']
    data: Call['data']
    chainId: NetworkDescriptor['chainId']
    nonce: number
    gasLimit: GasFeePayment['simulatedGasLimit']
    gasPrice: BigInt
  }) {
    if (!this.controller) {
      throw new Error('trezorSigner: trezorController not initialized')
    }

    const status = await this.controller.unlock()
    await delayPromise(status === 'just unlocked' ? DELAY_BETWEEN_POPUPS : 0)

    // The incoming `txnRequest` param types mismatch the Trezor expected ones,
    // so normalize the types before passing them to the Trezor API
    const unsignedTransaction: EthereumTransaction | EthereumTransactionEIP1559 = {
      ...txnRequest,
      // FIXME: Figure out why the values on Trezor screen mismatch
      value: txnRequest.value.toString(),
      gasLimit: txnRequest.gasLimit.toString(),
      gasPrice: txnRequest.gasPrice.toString(),
      nonce: txnRequest.nonce.toString(),
      chainId: Number(txnRequest.chainId) // assuming the value is a BigInt within the safe integer range
    }

    const res = await trezorConnect.ethereumSignTransaction({
      path: getHdPathFromTemplate(this.key.meta.hdPathTemplate, this.key.meta.index),
      transaction: unsignedTransaction
    })

    if (res.success) {
      const signedTxn = {
        ...unsignedTransaction,
        nonce: txnRequest.nonce,
        v: res.payload.v,
        r: res.payload.r,
        s: res.payload.s
      }

      // const intV = parseInt(res.payload.v, 16)

      // TODO: why?
      // const signedChainId = Math.floor((intV - EIP_155_CONSTANT) / 2)
      // if (signedChainId !== txnRequest.chainId) {
      //   throw new Error(`ledgerSigner: invalid returned V 0x${res.payload.v}`)
      // }

      // TODO: why?
      // delete txnRequest.v

      // TODO: Figure out if this serializes the transaction correctly
      const signature = Transaction.from(signedTxn).serialized

      // TODO: do this with EthersJS instead
      // const signature = serialize(transaction, {
      //   r: res.payload.r,
      //   s: res.payload.s,
      //   v: intV
      // })

      return signature
    }

    throw new Error((res.payload && res.payload.error) || 'trezorSigner: unknown error')
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
