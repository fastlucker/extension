export enum ConnectionStates {
  LOADING = 'LOADING',
  CONNECTED = 'CONNECTED',
  NOT_CONNECTED = 'NOT_CONNECTED'
}

export interface NetInfoContextReturnType {
  connectionState: ConnectionStates
}

export const netInfoContextDefaults = {
  connectionState: ConnectionStates.LOADING
}
