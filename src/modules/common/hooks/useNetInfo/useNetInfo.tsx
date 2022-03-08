import { useNetInfo as RnUseNetInfo } from '@react-native-community/netinfo'

interface Props {
  isConnected: null | boolean
}

export default function useNetInfo(): Props {
  const { isConnected, isInternetReachable } = RnUseNetInfo()

  const getIsConnected =
    // In case any of these is `null`, return `null`, it acts as a loading state
    isConnected === null || isInternetReachable === null ? null : isConnected && isInternetReachable

  return { isConnected: getIsConnected }
}
