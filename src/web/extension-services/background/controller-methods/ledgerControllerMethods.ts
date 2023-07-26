import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'

export class LedgerControllerMethods {
  ledgerCtrl: LedgerController

  constructor(_ledgerCtrl: LedgerController) {
    this.ledgerCtrl = _ledgerCtrl
  }

  async unlock(path?: string) {
    this.ledgerCtrl.unlock(path)
  }

  async getPathForIndex(index: number) {
    this.ledgerCtrl._getPathForIndex(index)
  }
}
