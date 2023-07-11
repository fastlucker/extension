import { KeystoreSigner } from 'ambire-common/src/interfaces/keystore'
import { Key } from 'ambire-common/src/libs/keystore/keystore'
import { stripHexPrefix, toChecksumAddress } from 'ethereumjs-util'

import trezorConnect from '@trezor/connect-web'
import { TREZOR_HD_PATH } from '@web/modules/hardware-wallet/constants/hdPaths'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'

import type { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'

class TrezorSigner implements KeystoreSigner {
  key: Key

  controller: TrezorController | null = null

  constructor(_key: Key) {
    this.key = _key
  }

  init(_controller: any) {
    this.controller = _controller
  }

  async signRawTransaction(params: any) {
    return Promise.resolve('')
  }

  async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, any>
  ) {
    return Promise.resolve('')
  }

  async signMessage(hash: string) {
    if (!this.controller) {
      throw new Error('trezorSigner: trezorController not initialized')
    }

    await this.controller.unlock()

    try {
      const res: any = await trezorConnect.ethereumSignMessage({
        path: this.key?.meta?.derivationPath || `${TREZOR_HD_PATH}/${this.key?.meta?.index}`,
        message: stripHexPrefix(hash),
        hex: true
      })

      if (res.payload.address !== toChecksumAddress(this.key.id)) {
        throw new Error("trezorSigner: the signature doesn't match the right address")
      }

      return `0x${res.payload.signature}`
    } catch (e: any) {
      throw new Error(`ledgerSigner: signature denied ${e.message || e}`)
    }
  }
}

export default TrezorSigner
