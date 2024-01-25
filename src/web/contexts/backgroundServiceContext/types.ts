import { Action, AsyncActionTypes } from '@web/extension-services/background/actions'

export type BackgroundServiceContextReturnType = {
  /**
   * Dispatches an action to the extension background service.
   * Does not return the result of the action.
   * It will only work when called from a focused window!
   */
  dispatch: (action: Action) => Promise<unknown>
  /**
   * Dispatches an action to the extension background service.
   * Returns a Promise with the result of the action.
   * The type of the result is derived from the 'AsyncActionTypes' mapping, based on the action type.
   *    * It will only work when called from a focused window!
   */
  dispatchAsync: <T extends keyof AsyncActionTypes>(action: {
    type: T
    params?: any
  }) => Promise<AsyncActionTypes[T]>
  isDefaultWallet: boolean
  setIsDefaultWallet: (val: boolean) => void
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  dispatch: Promise.resolve,
  dispatchAsync: Promise.resolve,
  isDefaultWallet: true,
  setIsDefaultWallet: () => {}
}
