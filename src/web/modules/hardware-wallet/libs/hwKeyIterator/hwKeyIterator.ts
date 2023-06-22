import { KeyIterator as KeyIteratorInterface } from 'ambire-common/src/interfaces/keyIterator'
import HDKey from 'hdkey'

import LedgerEth from '@ledgerhq/hw-app-eth'

const ethUtil = require('ethereumjs-util')
// DOCS
// - Serves for retrieving a range of addresses/keys from a given hardware wallet
// Currently supported hw are: Ledger | Trezor | Latice

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

export class HwKeyIterator implements KeyIteratorInterface {
  #walletType

  hdk?: HDKey

  app?: LedgerEth | null

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

        !!key && keys.push(key.publicKey)
      }
    }

    return keys
  }
}
