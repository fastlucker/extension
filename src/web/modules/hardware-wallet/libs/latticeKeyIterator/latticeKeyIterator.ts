import { Client } from 'gridplus-sdk'

import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { ExternalKey } from '@ambire-common/interfaces/keystore'

// DOCS
// - Serves for retrieving a range of addresses/keys from a Lattice hardware wallet

// USAGE
// const iterator = new LatticeKeyIterator({ hardware wallet props })
// const keys = await iterator.retrieve(0, 9, "derivation-path")

// eslint-disable-next-line @typescript-eslint/naming-convention
type WALLET_TYPE = {
  sdkSession?: Client | null
  getHDPathIndices: (hdPath: any, insertIdx?: number) => number[]
}

class LatticeKeyIterator implements KeyIteratorInterface {
  sdkSession?: Client | null

  getHDPathIndices: (
    hdPathTemplate: ExternalKey['meta']['hdPathTemplate'],
    insertIdx?: number
  ) => number[]

  constructor(_wallet: WALLET_TYPE) {
    if (
      !Object.prototype.hasOwnProperty.call(_wallet, 'sdkSession') ||
      !Object.prototype.hasOwnProperty.call(_wallet, 'getHDPathIndices')
    )
      throw new Error('latticeKeyIterator: invalid props passed to the constructor')

    this.sdkSession = _wallet.sdkSession
    this.getHDPathIndices = _wallet.getHDPathIndices
  }

  async retrieve(from: number, to: number, hdPathTemplate?: ExternalKey['meta']['hdPathTemplate']) {
    if ((!from && from !== 0) || (!to && to !== 0) || !hdPathTemplate)
      throw new Error('latticeKeyIterator: invalid or missing arguments')

    const keys: string[] = []

    const keyData = {
      startPath: this.getHDPathIndices(hdPathTemplate, from),
      n: to - from + 1
    }

    const res: any = await this.sdkSession?.getAddresses(keyData as any)
    keys.push(...res)

    return keys
  }
}

export default LatticeKeyIterator
