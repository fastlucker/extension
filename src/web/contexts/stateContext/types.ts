export type StateContextReturnType = {
  state: any
  isReady: boolean
}

export const stateContextDefaults: StateContextReturnType = {
  state: {},
  isReady: false
}
