import { KeyIterator as KeyIteratorInterface } from 'ambire-common/src/interfaces/keyIterator'
import { Client } from 'gridplus-sdk'
import HDKey from 'hdkey'

import LedgerEth from '@ledgerhq/hw-app-eth'

const ethUtil = require('ethereumjs-util')
// DOCS
// - Serves for retrieving a range of addresses/keys from a given hardware wallet
// Currently supported hw are: Ledger | Trezor | Lattice

// USAGE
// const iterator = new KeyIterator({ hardware wallet props })
// const keys = await iterator.retrieve(0, 9, "derivation-path")

// eslint-disable-next-line @typescript-eslint/naming-convention
type WALLET_TYPE =
  | {
      walletType: 'Trezor'
      hdk: HDKey
    }
  | {
      walletType: 'Ledger'
      hdk: HDKey
      app: LedgerEth | null
    }
  | {
      walletType: 'GridPlus'
      sdkSession?: Client | null
    }

export class HwKeyIterator implements KeyIteratorInterface {
  #walletType

  hdk?: HDKey

  app?: LedgerEth | null

  sdkSession?: Client | null

  constructor(_wallet: WALLET_TYPE) {
    if (!_wallet.walletType) throw new Error('keyIterator: wallet type not supported')

    this.#walletType = _wallet.walletType

    if (_wallet.walletType === 'Trezor') {
      this.hdk = _wallet.hdk
    }

    if (_wallet.walletType === 'Ledger') {
      this.hdk = _wallet.hdk
      this.app = _wallet.app
    }

    if (_wallet.walletType === 'GridPlus') {
      this.sdkSession = _wallet.sdkSession
    }
  }

  async retrieve(from: number, to: number, derivation: string = "m/44'/60'/0'") {
    if ((!from && from !== 0) || (!to && to !== 0) || !derivation)
      throw new Error('keyIterator: invalid or missing arguments')

    const keys: string[] = []

    if (this.#walletType === 'Trezor') {
      for (let i = from; i <= to; i++) {
        const dkey = this.hdk?.derive(`${derivation}/${i}`)
        const key = ethUtil.publicToAddress(dkey?.publicKey, true).toString('hex')

        !!key && keys.push(key)
      }
    }

    if (this.#walletType === 'Ledger') {
      for (let i = from; i <= to; i++) {
        // eslint-disable-next-line no-await-in-loop
        const key = await this.app!.getAddress(`44'/60'/${i}'/0/0`, false, true)

        !!key && keys.push(key.address)
      }
    }

    if (this.#walletType === 'GridPlus') {
      const keyData = {
        startPath: this._getHDPathIndices(derivation, from),
        n: to - from + 1
      }

      const res: any = await this.sdkSession?.getAddresses(keyData as any)
      keys.push(...res)
    }

    return keys
  }

  _getHDPathIndices(hdPath, insertIdx = 0) {
    const HARDENED_OFFSET = 0x80000000
    const path = hdPath.split('/').slice(1)
    const indices = []
    let usedX = false
    path.forEach((_idx) => {
      const isHardened = _idx[_idx.length - 1] === "'"
      let idx = isHardened ? HARDENED_OFFSET : 0
      // If there is an `x` in the path string, we will use it to insert our
      // index. This is useful for e.g. Ledger Live path. Most paths have the
      // changing index as the last one, so having an `x` in the path isn't
      // usually necessary.
      if (_idx.indexOf('x') > -1) {
        idx += insertIdx
        usedX = true
      } else if (isHardened) {
        idx += Number(_idx.slice(0, _idx.length - 1))
      } else {
        idx += Number(_idx)
      }
      indices.push(idx)
    })
    // If this path string does not include an `x`, we just append the index
    // to the end of the extracted set
    if (usedX === false) {
      indices.push(insertIdx)
    }
    // Sanity check -- Lattice firmware will throw an error for large paths
    if (indices.length > 5) throw new Error('Only HD paths with up to 5 indices are allowed.')
    return indices
  }
}
