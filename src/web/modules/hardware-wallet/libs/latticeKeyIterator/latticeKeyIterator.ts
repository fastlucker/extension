import { Client } from 'gridplus-sdk'

import { HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { getHDPathIndices } from '@ambire-common/utils/hdPath'

// DOCS
// - Serves for retrieving a range of addresses/keys from a Lattice hardware wallet

// USAGE
// const iterator = new LatticeKeyIterator({ hardware wallet props })
// const keys = await iterator.retrieve(0, 9, "derivation-path")

// eslint-disable-next-line @typescript-eslint/naming-convention
type WALLET_TYPE = {
  sdkSession?: Client | null
}

class LatticeKeyIterator implements KeyIteratorInterface {
  sdkSession?: Client | null

  constructor(_wallet: WALLET_TYPE) {
    if (!Object.prototype.hasOwnProperty.call(_wallet, 'sdkSession'))
      throw new Error('latticeKeyIterator: invalid props passed to the constructor')

    this.sdkSession = _wallet.sdkSession
  }

  async retrieve(from: number, to: number, hdPathTemplate?: HD_PATH_TEMPLATE_TYPE) {
    if ((!from && from !== 0) || (!to && to !== 0) || !hdPathTemplate)
      throw new Error('latticeKeyIterator: invalid or missing arguments')

    const keys: string[] = []

    const keyData = {
      startPath: getHDPathIndices(hdPathTemplate, from),
      n: to - from + 1
    }

    const res: any = await this.sdkSession?.getAddresses(keyData as any)
    keys.push(...res)

    return keys
  }
}

export default LatticeKeyIterator
