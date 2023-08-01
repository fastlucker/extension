import { Action } from '@web/extension-services/background/actions'
import { WalletControllerMethods } from '@web/extension-services/background/controller-methods/walletControllerMethods'

export type BackgroundServiceContextReturnType = {
  wallet: WalletControllerMethods
  /** Dispatches an action to the extension background service. */
  dispatch: (action: Action) => Promise<any> // TODO: return types for each action
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  wallet: null
} as any
