import { KeystoreSigner } from 'ambire-common/src/interfaces/keystore'
import { Key } from 'ambire-common/src/libs/keystore/keystore'

import { LATTICE_STANDARD_HD_PATH } from '@web/modules/hardware-wallet/constants/hdPaths'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'

import type { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'

class LatticeSigner implements KeystoreSigner {
  key: Key

  controller: LatticeController | null = null

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
      throw new Error('latticeSigner: trezorController not initialized')
    }

    if (!this.key) {
      throw new Error('latticeSigner: key not found')
    }

    await this._onBeforeLatticeRequest()

    const req = {
      currency: 'ETH_MSG',
      data: {
        protocol: 'signPersonal',
        payload: hash,
        signerPath: this.controller._getHDPathIndices(
          LATTICE_STANDARD_HD_PATH,
          this.key.meta!.index
        )
      }
    }

    const res = await this.controller.sdkSession!.sign(req)

    if (!res.sig) {
      throw new Error('latticeSigner: no signature returned')
    }

    // Convert the `v` to a number. It should convert to 0 or 1
    let v
    try {
      v = res.sig.v.toString('hex')
      if (v.length < 2) {
        v = `0${v}`
      }
    } catch (err) {
      throw new Error('latticeSigner: invalid signature format returned')
    }

    const foundIdx = await this.controller._keyIdxInCurrentWallet(this.key)
    if (foundIdx === null) {
      throw new Error('latticeSigner: key not found in the current Lattice wallet')
    }

    console.log('signed successfully: ', `0x${res.sig.r}${res.sig.s}${v}`)
    return `0x${res.sig.r}${res.sig.s}${v}`
  }

  async _onBeforeLatticeRequest() {
    const wasUnlocked = this.controller?.isUnlocked()
    await this.controller?.unlock()

    if (wasUnlocked) {
      await this.controller?._connect()
    }
  }
}

export default LatticeSigner
