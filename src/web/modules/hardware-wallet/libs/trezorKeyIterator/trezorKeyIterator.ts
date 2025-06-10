import { HDNodeWallet } from 'ethers'

import ExternalSignerError from '@ambire-common/classes/ExternalSignerError'
import { HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { getMessageFromTrezorErrorCode } from '@ambire-common/libs/trezor/trezor'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import { TrezorConnect } from '@web/modules/hardware-wallet/controllers/TrezorController'

interface KeyIteratorProps {
  walletSDK: TrezorConnect
}

/**
 * Serves for retrieving a range of addresses/keys from a Trezor hardware wallet
 */
class TrezorKeyIterator implements KeyIteratorInterface {
  type = 'trezor' as 'trezor'

  subType = 'hw' as 'hw'

  walletSDK: KeyIteratorProps['walletSDK']

  // Cache the extended public key that would allow calculating all addresses
  // in the range, to avoid unnecessary requests to the Trezor device.
  #xpub?: string

  constructor({ walletSDK }: KeyIteratorProps) {
    if (!walletSDK) throw new Error('trezorKeyIterator: missing walletSDK prop')

    this.walletSDK = walletSDK
  }

  private deriveAddressFromXpub(xpub: string, path: string, i: number): string {
    try {
      const hdNode = HDNodeWallet.fromExtendedKey(xpub)
      // If index is 0, return the address directly from the xpub node
      if (i === 0) return hdNode.address
      // For other indices, derive the child node
      const childNode = hdNode.deriveChild(i)
      return childNode.address
    } catch (error) {
      // TODO: Handle this!
      console.error('trezorKeyIterator: error deriving address from xpub', error)
      return ''
    }
  }

  async retrieve(
    fromToArr: { from: number; to: number }[],
    hdPathTemplate?: HD_PATH_TEMPLATE_TYPE
  ) {
    if (!this.walletSDK) throw new Error('trezorKeyIterator: walletSDK not initialized')

    const addrBundleToBeRequested: { path: string; showOnTrezor: boolean; i: number }[] = []
    fromToArr.forEach(({ from, to }) => {
      if ((!from && from !== 0) || (!to && to !== 0) || !hdPathTemplate)
        throw new Error('trezorKeyIterator: invalid or missing arguments')

      for (let i = from; i <= to; i++) {
        const path = getHdPathFromTemplate(hdPathTemplate, i)
        addrBundleToBeRequested.push({ path, showOnTrezor: false, i })
      }
    })

    if (!this.#xpub) {
      try {
        const res = await this.walletSDK.getPublicKey({
          coin: 'ETH',
          path: addrBundleToBeRequested[0].path,
          showOnTrezor: false
        })

        if (!res.success)
          throw new ExternalSignerError(
            getMessageFromTrezorErrorCode(res.payload.code, res.payload.error)
          )

        this.#xpub = res.payload.xpub
      } catch (error) {
        console.error('trezorKeyIterator: error getting xpub', error)
        throw new ExternalSignerError('trezorKeyIterator: error getting xpub')
      }
    }

    return addrBundleToBeRequested.map(({ path, i }) => {
      // TODO: Fix ts warn
      const address = this.deriveAddressFromXpub(this.#xpub, path, i)
      return address
    })
  }
}

export default TrezorKeyIterator
