import networks, { NetworkType } from 'ambire-common/src/constants/networks'
import useNetwork from 'ambire-common/src/hooks/network'
import React, { createContext, useMemo } from 'react'

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
  const { setNetwork, network, allNetworks } = useNetwork({
    useStorage
  })

  return (
    <NetworkContext.Provider
      value={useMemo(
        () => ({
          setNetwork,
          network,
          allNetworks
        }),
        [setNetwork, networks, network?.id]
      )}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export { NetworkContext, NetworkProvider }
