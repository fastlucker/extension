import { KeystoreSigner } from 'ambire-common/src/interfaces/keystore'
import { Key } from 'ambire-common/src/libs/keystore/keystore'
import { stripHexPrefix } from 'ethereumjs-util'

import { serialize } from '@ethersproject/transactions'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'

import type { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'

const EIP_155_CONSTANT = 35

class LedgerSigner implements KeystoreSigner {
  key: Key

  controller: LedgerController | null = null

  constructor(_key: Key) {
    this.key = _key
  }

  init(_controller: any) {
    this.controller = _controller
  }

  async signRawTransaction(params: any) {
    try {
      if (!this.controller) {
        throw new Error('ledgerSigner: ledgerController not initialized')
      }

      await this.controller.unlock(this.controller._getPathForIndex(this.key.meta?.index as number))
      const unsignedTxObj = {
        ...params,
        gasLimit: params.gasLimit || params.gas
      }

      delete unsignedTxObj.from
      delete unsignedTxObj.gas

      const serializedUnsigned = serialize(unsignedTxObj)

      // @ts-ignore
      const rsvRes = await this.controller.app.signTransaction(
        this.controller._getPathForIndex(this.key.meta?.index as number),
        serializedUnsigned.substr(2)
      )

      const intV = parseInt(rsvRes.v, 16)
      const signedChainId = Math.floor((intV - EIP_155_CONSTANT) / 2)

      if (signedChainId !== params.chainId) {
        throw new Error(`Invalid returned V 0x${rsvRes.v}`)
      }

      delete unsignedTxObj.v
      const signature = serialize(unsignedTxObj, {
        r: `0x${rsvRes.r}`,
        s: `0x${rsvRes.s}`,
        v: intV
      })

      return signature
    } catch (error: any) {
      throw new Error('Could not sign transaction', error.message)
    }
  }

  async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, any>
  ) {
    return Promise.resolve('')
  }

  async signMessage(hash: string) {
    try {
      if (!this.controller) {
        throw new Error('ledgerSigner: ledgerController not initialized')
      }
      await this.controller.unlock(this.controller._getPathForIndex(this.key.meta?.index as number))

      const rsvRes = await this.controller.app?.signPersonalMessage(
        this.controller._getPathForIndex(this.key.meta?.index as number),
        stripHexPrefix(hash)
      )

      const signature = `0x${rsvRes?.r}${rsvRes?.s}${rsvRes?.v.toString(16)}`

      return signature
    } catch (error: any) {
      throw new Error('Could not sign message', error.message)
    }
  }
}

export default LedgerSigner
