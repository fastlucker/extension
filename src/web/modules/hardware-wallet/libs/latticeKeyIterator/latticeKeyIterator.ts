import { getAddress } from 'ethers'
import { Client } from 'gridplus-sdk'

import { HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { getHDPathIndices } from '@ambire-common/utils/hdPath'

// eslint-disable-next-line @typescript-eslint/naming-convention
type KeyIteratorProps = {
  walletSDK: Client
}

/**
 * Serves for retrieving a range of addresses/keys from a Lattice hardware wallet
 */
class LatticeKeyIterator implements KeyIteratorInterface {
  type = 'lattice'

  walletSDK: KeyIteratorProps['walletSDK']

  constructor({ walletSDK }: KeyIteratorProps) {
    if (!walletSDK) throw new Error('latticeKeyIterator: missing walletSDK prop')

    this.walletSDK = walletSDK
  }

  async retrieve(
    fromToArr: { from: number; to: number }[],
    hdPathTemplate?: HD_PATH_TEMPLATE_TYPE
  ) {
    if (!this.walletSDK) throw new Error('latticeKeyIterator: walletSDK not initialized')

    const keys: string[] = []

    // eslint-disable-next-line no-restricted-syntax
    for (const { from, to } of fromToArr) {
      if ((!from && from !== 0) || (!to && to !== 0) || !hdPathTemplate)
        throw new Error('latticeKeyIterator: invalid or missing arguments')

      const keyData = {
        startPath: getHDPathIndices(hdPathTemplate, from),
        n: to - from + 1
      }

      // TODO: Figure out the corner cases when this returns Buffer[]
      // eslint-disable-next-line no-await-in-loop
      let res: string[] = await this.walletSDK.getAddresses(keyData)
      // For some reason, the addresses incoming from the device are not
      // checksumed, that's why manually checksum them here.
      res = res?.map((addr) => getAddress(addr)) || []
      keys.push(...res)
    }

    return keys
  }
}

export default LatticeKeyIterator
