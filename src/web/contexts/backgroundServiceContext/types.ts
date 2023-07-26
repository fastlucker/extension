import { LedgerControllerMethods } from '@web/extension-services/background/controller-methods/ledgerControllerMethods'
import { MainControllerMethods } from '@web/extension-services/background/controller-methods/mainControllerMethods'
import { WalletControllerMethods } from '@web/extension-services/background/controller-methods/walletControllerMethods'

export type BackgroundServiceContextReturnType = {
  mainCtrl: MainControllerMethods
  wallet: WalletControllerMethods
  ledgerCtrl: LedgerControllerMethods
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  mainCtrl: null,
  wallet: null,
  ledgerCtrl: null
} as any
