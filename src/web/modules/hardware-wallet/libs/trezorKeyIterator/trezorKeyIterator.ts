import { HDNodeWallet } from 'ethers'

import ExternalSignerError from '@ambire-common/classes/ExternalSignerError'
import { HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { getMessageFromTrezorErrorCode } from '@ambire-common/libs/trezor/trezor'
import { getHdPathFromTemplate, getParentHdPathFromTemplate } from '@ambire-common/utils/hdPath'
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

  private deriveAddressFromXpub(xpub: string, path: string, index: number): string {
    try {
      const hdNode = HDNodeWallet.fromExtendedKey(xpub)
      const childNode = hdNode.deriveChild(index)
      return childNode.address
    } catch (error: any) {
      throw new ExternalSignerError(
        `Could not generate Ethereum address from the extended public key received from your Trezor device. Technical details: <${error?.message}>.`
      )
    }
  }

  async retrieve(
    fromToArr: { from: number; to: number }[],
    hdPathTemplate?: HD_PATH_TEMPLATE_TYPE
  ) {
    if (!this.walletSDK) throw new Error('trezorKeyIterator: walletSDK not initialized')

    const addrBundleToBeRequested: { path: string; index: number }[] = []
    fromToArr.forEach(({ from, to }) => {
      if ((!from && from !== 0) || (!to && to !== 0) || !hdPathTemplate)
        throw new Error('trezorKeyIterator: invalid or missing arguments')

      for (let i = from; i <= to; i++) {
        const path = getHdPathFromTemplate(hdPathTemplate, i)
        addrBundleToBeRequested.push({ path, index: i })
      }
    })

    if (!this.#xpub) {
      try {
        const res = await this.walletSDK.getPublicKey({
          coin: 'ETH',
          // Always request the xpub from the first address (index 0). // An xpub
          // generated at index 0 lets you derive all addresses (0, 1, 2, ...).
          // If you generate an xpub at index 2, you can only derive addresses 2, 3, 4, etc.
          // You cannot derive earlier addresses (0 or 1) from an xpub generated at a higher index.
          path: getParentHdPathFromTemplate(hdPathTemplate!),
          showOnTrezor: false
        })

        if (!res.success)
          throw new ExternalSignerError(
            getMessageFromTrezorErrorCode(res.payload.code, res.payload.error)
          )

        this.#xpub = res.payload.xpub
      } catch (error: any) {
        if (error instanceof ExternalSignerError) throw error

        throw new ExternalSignerError(
          `Could not receive the extended public key from your Trezor device. Technical details: <${error?.message}>.`
        )
      }
    }

    return addrBundleToBeRequested.map(({ path, index }) => {
      // should never happen
      if (!this.#xpub)
        throw new ExternalSignerError(
          'Could not generate an Ethereum address because the extended public key is missing.'
        )

      return this.deriveAddressFromXpub(this.#xpub, path, index)
    })
  }
}

export default TrezorKeyIterator
