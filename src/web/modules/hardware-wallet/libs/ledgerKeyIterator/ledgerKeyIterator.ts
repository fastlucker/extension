import { HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import { Eth } from '@web/modules/hardware-wallet/controllers/LedgerController'

interface KeyIteratorProps {
  walletSDK: Eth
}

/**
 * Serves for retrieving a range of addresses/keys from a Ledger hardware wallet
 */
class LedgerKeyIterator implements KeyIteratorInterface {
  type = 'ledger'

  walletSDK: KeyIteratorProps['walletSDK']

  constructor({ walletSDK }: KeyIteratorProps) {
    if (!walletSDK) throw new Error('ledgerKeyIterator: missing walletSDK prop')

    this.walletSDK = walletSDK
  }

  async retrieve(
    fromToArr: { from: number; to: number }[],
    hdPathTemplate?: HD_PATH_TEMPLATE_TYPE
  ) {
    if (!this.walletSDK) throw new Error('trezorKeyIterator: walletSDK not initialized')

    const keys: string[] = []

    // eslint-disable-next-line no-restricted-syntax
    for (const { from, to } of fromToArr) {
      if ((!from && from !== 0) || (!to && to !== 0) || !hdPathTemplate)
        throw new Error('ledgerKeyIterator: invalid or missing arguments')

      for (let i = from; i <= to; i++) {
        // Purposely await in loop to avoid sending multiple requests at once,
        // because the Ledger device can't handle them in parallel.
        // eslint-disable-next-line no-await-in-loop
        const key = await this.walletSDK.getAddress(
          getHdPathFromTemplate(hdPathTemplate, i),
          false, // no need to show on display
          false // no need for the chain code
        )

        !!key && keys.push(key.address)
      }
    }

    return keys
  }
}

export default LedgerKeyIterator
