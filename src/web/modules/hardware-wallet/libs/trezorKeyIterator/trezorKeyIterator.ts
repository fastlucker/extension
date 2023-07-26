import { KeyIterator as KeyIteratorInterface } from 'ambire-common/src/interfaces/keyIterator'
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util'
import HDKey from 'hdkey'

import { TREZOR_HD_PATH } from '@web/modules/hardware-wallet/constants/hdPaths'

// DOCS
// - Serves for retrieving a range of addresses/keys from a Trezor hardware wallet

// USAGE
// const iterator = new TrezorKeyIterator({ hardware wallet props })
// const keys = await iterator.retrieve(0, 9, "derivation-path")

// eslint-disable-next-line @typescript-eslint/naming-convention
type WALLET_TYPE = {
  hdk: HDKey
}

class TrezorKeyIterator implements KeyIteratorInterface {
  hdk: HDKey

  constructor(_wallet: WALLET_TYPE) {
    if (!Object.prototype.hasOwnProperty.call(_wallet, 'hdk'))
      throw new Error('trezorKeyIterator: invalid props passed to the constructor')

    this.hdk = _wallet.hdk
  }

  async retrieve(from: number, to: number, derivation: string = TREZOR_HD_PATH) {
    if ((!from && from !== 0) || (!to && to !== 0) || !derivation)
      throw new Error('trezorKeyIterator: invalid or missing arguments')

    const keys: string[] = []

    for (let i = from; i <= to; i++) {
      const dkey = this.hdk?.derive(`${derivation}/${i}`)
      const key = publicToAddress(dkey?.publicKey, true).toString('hex')

      !!key && keys.push(toChecksumAddress(`0x${key}`))
    }

    return keys
  }
}

export default TrezorKeyIterator
