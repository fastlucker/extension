import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'

export class LedgerControllerMethods {
  ledgerCtrl: LedgerController

  constructor(_ledgerCtrl: LedgerController) {
    this.ledgerCtrl = _ledgerCtrl
  }

  async unlock(path?: string) {
    return this.ledgerCtrl.unlock(path)
  }

  async getPathForIndex(index: number) {
    return this.ledgerCtrl._getPathForIndex(index)
  }

  async getApp() {
    return this.ledgerCtrl.app
  }
}
