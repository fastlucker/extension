import HDKey from 'hdkey'

import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { ExternalKey } from '@ambire-common/interfaces/keystore'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import trezorConnect from '@trezor/connect-web'

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

  async retrieve(from: number, to: number, hdPathTemplate?: ExternalKey['meta']['hdPathTemplate']) {
    if ((!from && from !== 0) || (!to && to !== 0) || !hdPathTemplate)
      throw new Error('trezorKeyIterator: invalid or missing arguments')

    const bundle = []
    for (let i = from; i <= to; i++) {
      bundle.push({ path: getHdPathFromTemplate(hdPathTemplate, i), showOnTrezor: false })
    }
    const res = await trezorConnect.ethereumGetAddress({ bundle })

    if (!res.success) throw new Error('trezorKeyIterator: failed to retrieve keys')

    return res.payload.map(({ address }) => address)
  }
}

export default TrezorKeyIterator
