import { HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import { TrezorConnect } from '@web/modules/hardware-wallet/controllers/TrezorController'

interface KeyIteratorProps {
  walletSDK: TrezorConnect
}

/**
 * Serves for retrieving a range of addresses/keys from a Trezor hardware wallet
 */
class TrezorKeyIterator implements KeyIteratorInterface {
  type = 'trezor'

  walletSDK: KeyIteratorProps['walletSDK']

  // Cache the already retrieved addresses, to avoid unnecessary requests to the
  // Trezor device, because each request opens a popup window and requires the
  // user to explicitly approve exporting the addresses, which leads to a bad UX.
  cache: { [path: string]: string } = {}

  constructor({ walletSDK }: KeyIteratorProps) {
    if (!walletSDK) throw new Error('trezorKeyIterator: missing walletSDK prop')

    this.walletSDK = walletSDK
  }

  async retrieve(
    fromToArr: { from: number; to: number }[],
    hdPathTemplate?: HD_PATH_TEMPLATE_TYPE
  ) {
    if (!this.walletSDK) throw new Error('trezorKeyIterator: walletSDK not initialized')

    const addrBundleToBeRequested: { path: string; showOnTrezor: boolean }[] = []
    fromToArr.forEach(({ from, to }) => {
      if ((!from && from !== 0) || (!to && to !== 0) || !hdPathTemplate)
        throw new Error('trezorKeyIterator: invalid or missing arguments')

      for (let i = from; i <= to; i++) {
        const path = getHdPathFromTemplate(hdPathTemplate, i)
        addrBundleToBeRequested.push({ path, showOnTrezor: false })
      }
    })

    const areAllAddressesInCache = addrBundleToBeRequested.every(({ path }) => this.cache[path])
    if (areAllAddressesInCache) {
      return addrBundleToBeRequested.map(({ path }) => this.cache[path])
    }

    const res = await this.walletSDK.ethereumGetAddress({ bundle: addrBundleToBeRequested })

    if (!res.success) throw new Error('trezorKeyIterator: failed to retrieve keys')

    // Store the already retrieved addresses in the cache
    res.payload.forEach(({ address, serializedPath }) => {
      this.cache[serializedPath] = address
    })

    return res.payload.map(({ address }) => address)
  }
}

export default TrezorKeyIterator
