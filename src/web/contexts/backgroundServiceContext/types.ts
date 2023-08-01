import { Action } from '@web/extension-services/background/actions'

export type BackgroundServiceContextReturnType = {
  /** Dispatches an action to the extension background service. */
  dispatch: (action: Action) => Promise<any> // TODO: return types for each action
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  wallet: null
} as any
