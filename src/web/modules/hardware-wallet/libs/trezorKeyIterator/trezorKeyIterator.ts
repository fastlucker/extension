import { HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import trezorConnect from '@trezor/connect-web'

/**
 * Serves for retrieving a range of addresses/keys from a Trezor hardware wallet
 */
class TrezorKeyIterator implements KeyIteratorInterface {
  async retrieve(from: number, to: number, hdPathTemplate?: HD_PATH_TEMPLATE_TYPE) {
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
