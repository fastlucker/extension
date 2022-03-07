import { useEffect, useState } from 'react'

import NetInfo from '@react-native-community/netinfo'

export default function useNetInfo() {
  const [isConnected, setIsConnected] = useState<null | boolean>(null)
  const [type, setType] = useState(null)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected)
      setType(state.type)
    })

    return () => unsubscribe()
  }, [])

  return { isConnected, type }
}
