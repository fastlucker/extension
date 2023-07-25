import { networks } from 'ambire-common/src/consts/networks'
import { MainController as MainCtrl } from 'ambire-common/src/controllers/main/main'
import { Account } from 'ambire-common/src/interfaces/account'
import { JsonRpcProvider } from 'ethers'

export class MainControllerMethods {
  mainCtrl: MainCtrl

  providers: { [key: string]: JsonRpcProvider }

  constructor(_mainCtrl: MainCtrl, _providers: { [key: string]: JsonRpcProvider }) {
    this.mainCtrl = _mainCtrl
    this.providers = _providers
  }

  accountAdderInit(props: {
    _preselectedAccounts: Account[]
    _page?: number | undefined
    _pageSize?: number | undefined
    _derivationPath?: string | undefined
  }) {
    // TODO: add key iterator
    this.mainCtrl.accountAdder.init({ ...props })
    return true
  }

  async accountAdderGetSelectedAccounts() {
    return this.mainCtrl.accountAdder.selectedAccounts
  }

  async accountAdderGetPage(props: { page: number }) {
    return this.mainCtrl.accountAdder.getPage({ ...props, networks, providers: this.providers })
  }
}
