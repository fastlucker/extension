import { Action } from '@web/extension-services/background/actions'
import { WalletControllerMethods } from '@web/extension-services/background/controller-methods/walletControllerMethods'

export type BackgroundServiceContextReturnType = {
  wallet: WalletControllerMethods
  /** Dispatches an action to the background service. */
  dispatch: (action: Action) => Promise<unknown>
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  wallet: null
} as any
