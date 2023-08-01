import { LedgerControllerMethods } from '@web/extension-services/background/controller-methods/ledgerControllerMethods'
import { MainControllerMethods } from '@web/extension-services/background/controller-methods/mainControllerMethods'
import { WalletControllerMethods } from '@web/extension-services/background/controller-methods/walletControllerMethods'

type Action = {
  type: string // TODO: large compound (discriminating union) type with all the actions
  params?: any
}

export type BackgroundServiceContextReturnType = {
  mainCtrl: MainControllerMethods
  wallet: WalletControllerMethods
  ledgerCtrl: LedgerControllerMethods
  /** Dispatches an action to the background service. */
  dispatch: (action: Action) => Promise<unknown>
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  mainCtrl: null,
  wallet: null,
  ledgerCtrl: null
} as any
