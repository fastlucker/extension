import React, { createContext, useMemo } from 'react'

enum ConnectionStates {
  LOADING = 'LOADING',
  CONNECTED = 'CONNECTED',
  NOT_CONNECTED = 'NOT_CONNECTED'
}

export interface NetInfoContextReturnType {
  connectionState: ConnectionStates
}

const NetInfoContext = createContext<NetInfoContextReturnType>({
  connectionState: ConnectionStates.LOADING
})

const NetInfoProvider: React.FC = ({ children }) => {
  return (
    <NetInfoContext.Provider
      value={useMemo(() => ({ connectionState: ConnectionStates.CONNECTED }), [])}
    >
      {children}
    </NetInfoContext.Provider>
  )
}

export { NetInfoContext, NetInfoProvider, ConnectionStates }
