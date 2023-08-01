import { MainControllerMethods } from '@web/extension-services/background/controller-methods/mainControllerMethods'
import { WalletControllerMethods } from '@web/extension-services/background/controller-methods/walletControllerMethods'

type Action = {
  type: string // TODO: large compound (discriminating union) type with all the actions
  params?: any
}

export type BackgroundServiceContextReturnType = {
  mainCtrl: MainControllerMethods
  wallet: WalletControllerMethods
  /** Dispatches an action to the background service. */
  dispatch: (action: Action) => Promise<unknown>
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  mainCtrl: null,
  wallet: null
} as any
