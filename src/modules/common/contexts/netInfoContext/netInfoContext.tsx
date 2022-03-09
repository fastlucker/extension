import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import NetInfo, { useNetInfo as RnUseNetInfo } from '@react-native-community/netinfo'

enum ConnectionStates {
  LOADING = 'LOADING',
  CONNECTED = 'CONNECTED',
  NOT_CONNECTED = 'NOT_CONNECTED'
}

type NetInfoContextData = {
  connectionState: ConnectionStates
  isConnected: boolean
  checkIsConnected: () => Promise<ConnectionStates>
}

const NetInfoContext = createContext<NetInfoContextData>({
  connectionState: ConnectionStates.LOADING,
  isConnected: false,
  checkIsConnected: () => Promise.resolve(ConnectionStates.LOADING)
})

const NetInfoProvider: React.FC = ({ children }) => {
  const [connectionState, setConnectionState] = useState<ConnectionStates>(ConnectionStates.LOADING)
  const { isConnected, isInternetReachable } = RnUseNetInfo()

  const checkIsConnected = useCallback(async () => {
    const state = await NetInfo.fetch()

    const currentState =
      !!state.isConnected && !!state.isInternetReachable
        ? ConnectionStates.CONNECTED
        : ConnectionStates.NOT_CONNECTED

    setConnectionState(currentState)
    return currentState
  }, [])

  const getIsConnected = (_isConnected: null | boolean, _isInternetReachable: null | boolean) => {
    if (_isConnected === null || _isInternetReachable === null) {
      return ConnectionStates.LOADING
    }

    return _isConnected && _isInternetReachable
      ? ConnectionStates.CONNECTED
      : ConnectionStates.NOT_CONNECTED
  }

  useEffect(() => {
    setConnectionState(getIsConnected(isConnected, isInternetReachable))
  }, [isConnected, isInternetReachable])

  return (
    <NetInfoContext.Provider
      value={useMemo(
        () => ({
          isConnected: connectionState === ConnectionStates.CONNECTED,
          connectionState,
          checkIsConnected
        }),
        [connectionState, checkIsConnected]
      )}
    >
      {children}
    </NetInfoContext.Provider>
  )
}

export { NetInfoContext, NetInfoProvider, ConnectionStates }
