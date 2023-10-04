import { Client } from 'gridplus-sdk'

import { LATTICE_STANDARD_HD_PATH } from '@ambire-common/consts/derivation'
import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'

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

  getHDPathIndices: (hdPath: any, insertIdx?: number) => number[]

  constructor(_wallet: WALLET_TYPE) {
    if (
      !Object.prototype.hasOwnProperty.call(_wallet, 'sdkSession') ||
      !Object.prototype.hasOwnProperty.call(_wallet, 'getHDPathIndices')
    )
      throw new Error('latticeKeyIterator: invalid props passed to the constructor')

    this.sdkSession = _wallet.sdkSession
    this.getHDPathIndices = _wallet.getHDPathIndices
  }

  async retrieve(from: number, to: number, derivation: string = LATTICE_STANDARD_HD_PATH) {
    if ((!from && from !== 0) || (!to && to !== 0) || !derivation)
      throw new Error('latticeKeyIterator: invalid or missing arguments')

    const keys: string[] = []

    const keyData = {
      startPath: this.getHDPathIndices(derivation, from),
      n: to - from + 1
    }

    const res: any = await this.sdkSession?.getAddresses(keyData as any)
    keys.push(...res)

    return keys
  }
}

export default LatticeKeyIterator
