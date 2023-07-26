import { networks } from 'ambire-common/src/consts/networks'
import { MainController as MainCtrl } from 'ambire-common/src/controllers/main/main'
import { Account } from 'ambire-common/src/interfaces/account'
import { JsonRpcProvider } from 'ethers'

import {
  HARDWARE_WALLETS,
  HARDWARE_WALLETS_TYPES
} from '@web/modules/hardware-wallet/constants/common'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'
import LatticeKeyIterator from '@web/modules/hardware-wallet/libs/latticeKeyIterator'
import LedgerKeyIterator from '@web/modules/hardware-wallet/libs/ledgerKeyIterator'
import TrezorKeyIterator from '@web/modules/hardware-wallet/libs/trezorKeyIterator'

export class MainControllerMethods {
  mainCtrl: MainCtrl

  ledgerCtrl: LedgerController

  trezorCtrl: TrezorController

  latticeCtrl: LatticeController

  providers: { [key: string]: JsonRpcProvider }

  constructor({
    mainCtrl,
    providers,
    ledgerCtrl,
    trezorCtrl,
    latticeCtrl
  }: {
    mainCtrl: MainCtrl
    providers: { [key: string]: JsonRpcProvider }
    ledgerCtrl: LedgerController
    trezorCtrl: TrezorController
    latticeCtrl: LatticeController
  }) {
    this.mainCtrl = mainCtrl
    this.ledgerCtrl = ledgerCtrl
    this.trezorCtrl = trezorCtrl
    this.latticeCtrl = latticeCtrl

    this.providers = providers
  }

  accountAdderInit(
    props: {
      _preselectedAccounts: Account[]
      _page?: number | undefined
      _pageSize?: number | undefined
      _derivationPath?: string | undefined
    },
    hardwareWallet: HARDWARE_WALLETS_TYPES
  ) {
    let keyIterator
    if (hardwareWallet === HARDWARE_WALLETS.LEDGER) {
      keyIterator = new LedgerKeyIterator({ hdk: this.ledgerCtrl.hdk, app: this.ledgerCtrl.app })
    } else if (hardwareWallet === HARDWARE_WALLETS.TREZOR) {
      keyIterator = new TrezorKeyIterator({ hdk: this.trezorCtrl.hdk })
    } else if (hardwareWallet === HARDWARE_WALLETS.GRIDPLUS) {
      keyIterator = new LatticeKeyIterator({
        sdkSession: this.latticeCtrl.sdkSession,
        getHDPathIndices: this.latticeCtrl._getHDPathIndices
      })
    } else {
      // TODO:
      // keyIterator = new KeyIterator()
    }
    return this.mainCtrl.accountAdder.init({ ...props, _keyIterator: keyIterator })
  }

  async accountAdderGetSelectedAccounts() {
    return this.mainCtrl.accountAdder.selectedAccounts
  }

  async accountAdderGetPageAddresses() {
    return this.mainCtrl.accountAdder.pageAddresses
  }

  async accountAdderGetPage(props: { page: number }) {
    return this.mainCtrl.accountAdder.getPage({ ...props, networks, providers: this.providers })
  }
}
