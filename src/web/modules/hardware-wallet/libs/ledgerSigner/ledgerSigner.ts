import { stripHexPrefix } from 'ethereumjs-util'

import { ExternalKey, KeystoreSigner } from '@ambire-common/interfaces/keystore'
import { TypedMessage } from '@ambire-common/interfaces/userRequest'
import { serialize } from '@ethersproject/transactions'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'

const EIP_155_CONSTANT = 35

class LedgerSigner implements KeystoreSigner {
  key: ExternalKey

  controller: LedgerController | null = null

  constructor(_key: ExternalKey) {
    this.key = _key
  }

  init(_controller: any) {
    this.controller = _controller
  }

  async signRawTransaction(params: any) {
    if (!this.controller) {
      throw new Error('ledgerSigner: ledgerController not initialized')
    }

    await this.controller._reconnect()

    await this.controller.unlock(this.key.meta.hdPath)

    try {
      const unsignedTxObj = {
        ...params,
        gasLimit: params.gasLimit || params.gas
      }

      delete unsignedTxObj.from
      delete unsignedTxObj.gas

      const serializedUnsigned = serialize(unsignedTxObj)

      // @ts-ignore
      const rsvRes = await this.controller.app.signTransaction(
        this.key.meta.hdPath,
        serializedUnsigned.substr(2) // TODO: maybe use stripHexPrefix instead
      )

      const intV = parseInt(rsvRes.v, 16)
      const signedChainId = Math.floor((intV - EIP_155_CONSTANT) / 2)

      if (signedChainId !== params.chainId) {
        throw new Error(`ledgerSigner: invalid returned V 0x${rsvRes.v}`)
      }

      delete unsignedTxObj.v
      const signature = serialize(unsignedTxObj, {
        r: `0x${rsvRes.r}`,
        s: `0x${rsvRes.s}`,
        v: intV
      })

      return signature
    } catch (e: any) {
      throw new Error(`ledgerSigner: signature denied ${e.message || e}`)
    }
  }

  async signTypedData({ domain, types, message, primaryType }: TypedMessage) {
    if (!this.controller) {
      throw new Error(
        'Something went wrong with triggering the sign message mechanism. Please try again or contact support if the problem persists.'
      )
    }

    await this.controller.unlock(this.key.meta.hdPath)

    if (!types.EIP712Domain) {
      throw new Error(
        'Ambire only supports signing EIP712 typed data messages. Please try again with a valid EIP712 message.'
      )
    }

    if (!primaryType) {
      throw new Error(
        'The primaryType is missing in the typed data message incoming. Please try again with a valid EIP712 message.'
      )
    }

    try {
      const rsvRes = await this.controller.app!.signEIP712Message(this.key.meta.hdPath, {
        domain,
        types,
        message,
        primaryType
      })

      const signature = `0x${rsvRes.r}${rsvRes.s}${rsvRes.v.toString(16)}`
      return signature
    } catch (e: any) {
      throw new Error(
        e?.message ||
          'Signing the typed data message failed. Please try again or contact Ambire support if issue persists.'
      )
    }
  }

  async signMessage(hash: string | Uint8Array) {
    if (!this.controller) {
      throw new Error(
        'Something went wrong with triggering the sign message mechanism. Please try again or contact support if the problem persists.'
      )
    }

    if (hash instanceof Uint8Array) {
      throw new Error(
        "Request for signing a Uint8Array detected. That's not a typical sign message request and it is disallowed with Ambire."
      )
    }

    if (!stripHexPrefix(hash)) {
      throw new Error(
        'Request for signing an empty message detected. Signing empty messages with Ambire is disallowed.'
      )
    }

    await this.controller.unlock(this.key.meta.hdPath)

    try {
      const rsvRes = await this.controller.app!.signPersonalMessage(
        this.key.meta.hdPath,
        stripHexPrefix(hash)
      )

      const signature = `0x${rsvRes?.r}${rsvRes?.s}${rsvRes?.v.toString(16)}`
      return signature
    } catch (e: any) {
      throw new Error(
        e?.message ||
          'Signing the message failed. Please try again or contact Ambire support if issue persists.'
      )
    }
  }
}

export default LedgerSigner
