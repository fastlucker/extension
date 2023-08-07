import { Action, AsyncActionTypes } from '@web/extension-services/background/actions'

export type BackgroundServiceContextReturnType = {
  state: any
  isReady: boolean
  stateDispatch: React.Dispatch<any>
  /**
   * Dispatches an action to the extension background service.
   * Does not return the result of the action.
   */
  dispatch: (action: Action) => Promise<unknown>
  /**
   * Dispatches an action to the extension background service.
   * Returns a Promise with the result of the action.
   * The type of the result is derived from the 'AsyncActionTypes' mapping, based on the action type.
   */
  dispatchAsync: <T extends keyof AsyncActionTypes>(action: {
    type: T
    params?: any
  }) => Promise<AsyncActionTypes[T]>
}

export const backgroundServiceContextDefaults: BackgroundServiceContextReturnType = {
  state: {},
  isReady: false,
  stateDispatch: () => {},
  dispatch: Promise.resolve,
  dispatchAsync: Promise.resolve
}
