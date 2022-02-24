import React, { createContext, useCallback, useMemo } from 'react'

import networks, { NetworkType } from '@modules/common/constants/networks'
import useStorage from '@modules/common/hooks/useStorage'

const defaultNetwork = 'ethereum'

type NetworkContextData = {
  setNetwork: (networkIdentifier: string | number) => void
  network: NetworkType | undefined
  allNetworks: NetworkType[]
}

const NetworkContext = createContext<NetworkContextData>({
  setNetwork: () => {},
  network: networks.find((n) => n.id === defaultNetwork),
  allNetworks: networks
})

const NetworkProvider: React.FC = ({ children }) => {
  const [networkId, setNetworkId] = useStorage({
    key: 'network',
    defaultValue: defaultNetwork,
    isStringStorage: true,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setInit: (networkId: any) =>
      networks.find((n) => n.id === networkId) ? networkId : defaultNetwork
  })

  const setNetwork = useCallback(
    (networkIdentifier) => {
      const network = networks.find(
        (n) =>
          n.id === networkIdentifier ||
          n.name === networkIdentifier ||
          n.chainId === networkIdentifier
      )
      if (!network) throw new Error(`no network found: ${networkIdentifier}`)

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
          allNetworks: networks
        }),
        [setNetwork, networks, networkId]
      )}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export { NetworkContext, NetworkProvider }
