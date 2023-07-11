import { KeystoreSigner } from 'ambire-common/src/interfaces/keystore'
import { Key } from 'ambire-common/src/libs/keystore/keystore'
import { stripHexPrefix, toChecksumAddress } from 'ethereumjs-util'

import { delayPromise } from '@common/utils/promises'
import transformTypedData from '@trezor/connect-plugin-ethereum'
import trezorConnect from '@trezor/connect-web'
import { TREZOR_HD_PATH } from '@web/modules/hardware-wallet/constants/hdPaths'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'

import type { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'

const DELAY_BETWEEN_POPUPS = 1000

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
    message: Record<string, any>,
    primaryType?: string
  ) {
    if (!this.controller) {
      throw new Error('trezorSigner: trezorController not initialized')
    }

    if (!types.EIP712Domain) {
      throw new Error('trezorSigner: only eth_signTypedData_v4 is supported')
    }

    const dataWithHashes: any = transformTypedData({ domain, types, message, primaryType }, true)

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { domain_separator_hash, message_hash } = dataWithHashes

    // This is necessary to avoid popup collision
    // between the unlock & sign trezor popups
    const status = await this.controller.unlock()
    await delayPromise(status === 'just unlocked' ? DELAY_BETWEEN_POPUPS : 0)

    const res: any = await trezorConnect.ethereumSignTypedData({
      path: this.key?.meta?.derivationPath || `${TREZOR_HD_PATH}/${this.key?.meta?.index}`,
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

    if (res.success) {
      if (res.payload.address !== toChecksumAddress(this.key.id)) {
        throw new Error("trezorSigner: signature doesn't match the right address")
      }

      return res.payload.signature
    }

    throw new Error((res.payload && res.payload.error) || 'trezorSigner: unknown error')
  }

  async signMessage(hash: string) {
    if (!this.controller) {
      throw new Error('trezorSigner: trezorController not initialized')
    }

    const status = await this.controller.unlock()
    await delayPromise(status === 'just unlocked' ? DELAY_BETWEEN_POPUPS : 0)

    const res: any = await trezorConnect.ethereumSignMessage({
      path: this.key?.meta?.derivationPath || `${TREZOR_HD_PATH}/${this.key?.meta?.index}`,
      message: stripHexPrefix(hash),
      hex: true
    })

    if (res.success) {
      if (res.payload.address !== toChecksumAddress(this.key.id)) {
        throw new Error("trezorSigner: the signature doesn't match the right address")
      }
      return `0x${res.payload.signature}`
    }

    throw new Error((res.payload && res.payload.error) || 'trezorSigner: unknown error')
  }
}

export default TrezorSigner
