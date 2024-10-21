import React, { createContext, FC, useCallback, useMemo, useState } from 'react'

import { networks as predefinedNetworks } from '@ambire-common/consts/networks'
import { ChainlistNetwork, Network } from '@ambire-common/interfaces/network'
import { convertToAmbireNetworkFormat } from '@ambire-common/utils/networks'

type Props = {
  children: React.ReactNode
}
type NetworksContextType = {
  benzinNetworks: Network[]
  addNetwork: (chainId: bigint) => void
  loadingBenzinNetworks: bigint[]
}

const benzinNetworksContext = createContext<NetworksContextType>({
  benzinNetworks: [],
  addNetwork: () => {},
  loadingBenzinNetworks: []
})

const fetchNetworkData = async (chainId: bigint) => {
  const chainsRequest = await fetch('https://chainid.network/chains.json')
  const chains = await chainsRequest.json()

  const networkDataInChainlistNetworkFormat = chains.find(
    (chainlistNetwork: ChainlistNetwork) => chainlistNetwork.chainId === Number(chainId)
  )

  if (!networkDataInChainlistNetworkFormat) return

  const networkDataInAmbireNetworkFormat = await convertToAmbireNetworkFormat(
    networkDataInChainlistNetworkFormat
  )

  return networkDataInAmbireNetworkFormat
}

const BenzinNetworksContextProvider: FC<Props> = ({ children }) => {
  const [benzinNetworks, setBenzinNetworks] = useState<Network[]>(predefinedNetworks)
  const [loadingBenzinNetworks, setLoadingBenzinNetworks] = useState<bigint[]>([])

  const addNetwork = useCallback(
    async (chainId: bigint) => {
      if (loadingBenzinNetworks.includes(chainId)) return

      setLoadingBenzinNetworks((prevLoadingNetworks) => [...prevLoadingNetworks, chainId])
      try {
        const networkExists = benzinNetworks.some((network) => network.chainId === chainId)
        if (networkExists) return

        const networkData = await fetchNetworkData(chainId)

        if (!networkData) return

        setBenzinNetworks((prevNetworks) => [...prevNetworks, networkData])
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingBenzinNetworks((prevLoadingNetworks) =>
          prevLoadingNetworks.filter((loadingChainId) => loadingChainId !== chainId)
        )
      }
    },
    [loadingBenzinNetworks, benzinNetworks]
  )

  const value = useMemo(
    () => ({
      benzinNetworks,
      addNetwork,
      loadingBenzinNetworks
    }),
    [addNetwork, loadingBenzinNetworks, benzinNetworks]
  )

  return <benzinNetworksContext.Provider value={value}>{children}</benzinNetworksContext.Provider>
}

export { BenzinNetworksContextProvider, benzinNetworksContext }
