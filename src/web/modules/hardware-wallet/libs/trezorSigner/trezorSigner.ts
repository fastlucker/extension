import { stripHexPrefix } from 'ethereumjs-util'

import { TREZOR_HD_PATH } from '@ambire-common/consts/derivation'
import { ExternalKey, KeystoreSigner } from '@ambire-common/interfaces/keystore'
import { TypedMessage } from '@ambire-common/interfaces/userRequest'
import { delayPromise } from '@common/utils/promises'
import { serialize } from '@ethersproject/transactions'
import transformTypedData from '@trezor/connect-plugin-ethereum'
import trezorConnect from '@trezor/connect-web'
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

  async signRawTransaction(params: any) {
    if (!this.controller) {
      throw new Error('trezorSigner: trezorController not initialized')
    }

    const status = await this.controller.unlock()
    await delayPromise(status === 'just unlocked' ? DELAY_BETWEEN_POPUPS : 0)

    const unsignedTxObj = {
      ...params,
      gasLimit: params.gasLimit || params.gas
    }

    delete unsignedTxObj.from
    delete unsignedTxObj.gas

    const res: any = await trezorConnect.ethereumSignTransaction({
      path: this.key.meta.hdPath,
      transaction: unsignedTxObj
    })

    if (res.success) {
      const intV = parseInt(res.payload.v, 16)
      const signedChainId = Math.floor((intV - EIP_155_CONSTANT) / 2)

      if (signedChainId !== params.chainId) {
        throw new Error(`ledgerSigner: invalid returned V 0x${res.payload.v}`)
      }
      delete unsignedTxObj.v

      const signature = serialize(unsignedTxObj, {
        r: res.payload.r,
        s: res.payload.s,
        v: intV
      })

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
      path: this.key.meta.hdPath,
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
      path: this.key.meta.hdPath,
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
