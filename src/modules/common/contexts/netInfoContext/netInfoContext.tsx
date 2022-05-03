import React, { createContext, useMemo } from 'react'

import { useNetInfo as RnUseNetInfo } from '@react-native-community/netinfo'

enum ConnectionStates {
  LOADING = 'LOADING',
  CONNECTED = 'CONNECTED',
  NOT_CONNECTED = 'NOT_CONNECTED'
}

type NetInfoContextData = {
  connectionState: ConnectionStates
}

const NetInfoContext = createContext<NetInfoContextData>({
  connectionState: ConnectionStates.LOADING
})

const checkIsConnected = (isConnected: boolean | null): ConnectionStates => {
  if (isConnected === null || typeof isConnected !== 'boolean') {
    return ConnectionStates.LOADING
  }

  return isConnected ? ConnectionStates.CONNECTED : ConnectionStates.NOT_CONNECTED
}

const NetInfoProvider: React.FC = ({ children }) => {
  const { isConnected } = RnUseNetInfo()

  const connectionState = checkIsConnected(isConnected)

  return (
    <NetInfoContext.Provider value={useMemo(() => ({ connectionState }), [connectionState])}>
      {children}
    </NetInfoContext.Provider>
  )
}

export { NetInfoContext, NetInfoProvider, ConnectionStates }
