import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import networks from '@modules/common/constants/networks'
import AsyncStorage from '@react-native-async-storage/async-storage'

const defaultNetwork = 'ethereum'

type NetworkContextData = {
  setNetwork: (networkId: string) => void
  network: any
  allNetworks: any
}

const NetworkContext = createContext<NetworkContextData>({
  setNetwork: () => {},
  network: networks.find((n) => n.id === defaultNetwork),
  allNetworks: networks,
})

const NetworkProvider: React.FC = ({ children }) => {
  const [networkId, setNetworkId] = useState<string | null>(defaultNetwork)

  useEffect(() => {
    ;(async () => {
      const network = await AsyncStorage.getItem('network')
      setNetworkId(networks.find((n) => n.id === network) ? network : defaultNetwork)
    })()
  }, [])

  const setNetwork = useCallback(
    (networkIdentifier) => {
      const network = networks.find(
        (n) =>
          n.id === networkIdentifier ||
          n.name === networkIdentifier ||
          n.chainId === networkIdentifier
      )
      if (!network) throw new Error(`no network found: ${networkIdentifier}`)
      AsyncStorage.setItem('network', network.id)
      setNetworkId(network.id)
    },
    [setNetworkId]
  )

  return (
    <NetworkContext.Provider
      value={useMemo(
        () => ({
          setNetwork,
          network: networks.find((n) => n.id === networkId),
          allNetworks: networks,
        }),
        [setNetwork, networks]
      )}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export { NetworkContext, NetworkProvider }
