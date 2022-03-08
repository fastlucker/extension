import { useCallback, useEffect, useState } from 'react'

import NetInfo, { useNetInfo as RnUseNetInfo } from '@react-native-community/netinfo'

interface Props {
  isConnected: null | boolean
  checkIsConnected: () => Promise<boolean>
}

export default function useNetInfo(): Props {
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

  return { isConnected: isConnectedAndReachable, checkIsConnected }
}
