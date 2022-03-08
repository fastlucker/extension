import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import NetInfo, { useNetInfo as RnUseNetInfo } from '@react-native-community/netinfo'

type NetInfoContextData = {
  isConnected: null | boolean
  checkIsConnected: () => Promise<boolean>
}

const NetInfoContext = createContext<NetInfoContextData>({
  isConnected: null,
  checkIsConnected: () => Promise.resolve(false)
})

const NetInfoProvider: React.FC = ({ children }) => {
  const [isConnectedAndReachable, setIsConnectedAndReachable] = useState<boolean | null>(null)
  const { isConnected, isInternetReachable } = RnUseNetInfo()

  const checkIsConnected = useCallback(async () => {
    const state = await NetInfo.fetch()

    setIsConnectedAndReachable(!!state.isConnected && !!state.isInternetReachable)

    return !!state.isConnected && !!state.isInternetReachable
  }, [])

  const getIsConnected = (_isConnected: null | boolean, _isInternetReachable: null | boolean) => {
    // In case any of these is `null`, return `null`, it acts as a loading state
    return _isConnected === null || _isInternetReachable === null
      ? null
      : _isConnected && _isInternetReachable
  }

  useEffect(() => {
    setIsConnectedAndReachable(getIsConnected(isConnected, isInternetReachable))
  }, [isConnected, isInternetReachable])

  return (
    <NetInfoContext.Provider
      value={useMemo(
        () => ({
          isConnected: isConnectedAndReachable,
          checkIsConnected
        }),
        [isConnectedAndReachable, checkIsConnected]
      )}
    >
      {children}
    </NetInfoContext.Provider>
  )
}

export { NetInfoContext, NetInfoProvider }
