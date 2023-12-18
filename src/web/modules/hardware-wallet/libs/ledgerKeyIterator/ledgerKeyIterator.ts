import { HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import { KeyIterator as KeyIteratorInterface } from '@ambire-common/interfaces/keyIterator'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import LedgerEth from '@ledgerhq/hw-app-eth'

// eslint-disable-next-line @typescript-eslint/naming-convention
type WALLET_TYPE = {
  app: LedgerEth | null
}

/**
 * Serves for retrieving a range of addresses/keys from a Ledger hardware wallet
 */
class LedgerKeyIterator implements KeyIteratorInterface {
  app?: LedgerEth | null

  constructor(_wallet: WALLET_TYPE) {
    if (!Object.prototype.hasOwnProperty.call(_wallet, 'app'))
      throw new Error('ledgerKeyIterator: invalid props passed to the constructor')

    this.app = _wallet.app
  }

  async retrieve(from: number, to: number, hdPathTemplate?: HD_PATH_TEMPLATE_TYPE) {
    if ((!from && from !== 0) || (!to && to !== 0) || !hdPathTemplate)
      throw new Error('ledgerKeyIterator: invalid or missing arguments')

    const keys: string[] = []

    for (let i = from; i <= to; i++) {
      // eslint-disable-next-line no-await-in-loop
      const key = await this.app!.getAddress(getHdPathFromTemplate(hdPathTemplate, i), false, true)

      !!key && keys.push(key.address)
    }

    return keys
  }
}

export default LedgerKeyIterator
