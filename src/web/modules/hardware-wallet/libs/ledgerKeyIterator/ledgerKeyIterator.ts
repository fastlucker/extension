import HDKey from 'hdkey'

import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import LedgerEth from '@ledgerhq/hw-app-eth'

// DOCS
// - Serves for retrieving a range of addresses/keys from a Ledger hardware wallet

// USAGE
// const iterator = new LedgerKeyIterator({ hardware wallet props })
// const keys = await iterator.retrieve(0, 9)

// eslint-disable-next-line @typescript-eslint/naming-convention
type WALLET_TYPE = {
  hdk: HDKey
  app: LedgerEth | null
}

class LedgerKeyIterator implements KeyIteratorInterface {
  hdk?: HDKey

  app?: LedgerEth | null

  constructor(_wallet: WALLET_TYPE) {
    if (
      !Object.prototype.hasOwnProperty.call(_wallet, 'hdk') ||
      !Object.prototype.hasOwnProperty.call(_wallet, 'app')
    )
      throw new Error('ledgerKeyIterator: invalid props passed to the constructor')

    this.hdk = _wallet.hdk
    this.app = _wallet.app
  }

  async retrieve(from: number, to: number, derivation: string = "m/44'/60'/0'") {
    if ((!from && from !== 0) || (!to && to !== 0) || !derivation)
      throw new Error('ledgerKeyIterator: invalid or missing arguments')

    const keys: string[] = []

    for (let i = from; i <= to; i++) {
      // eslint-disable-next-line no-await-in-loop
      const key = await this.app!.getAddress(`44'/60'/${i}'/0/0`, false, true)

      !!key && keys.push(key.address)
    }

    return keys
  }
}

export default LedgerKeyIterator
