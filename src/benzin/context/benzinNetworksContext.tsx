import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react'

import { networks as predefinedNetworks } from '@ambire-common/consts/networks'
import { ChainlistNetwork, Network } from '@ambire-common/interfaces/network'
import { relayerCall } from '@ambire-common/libs/relayerCall/relayerCall'
import { convertToAmbireNetworkFormat } from '@ambire-common/utils/networks'
import { RELAYER_URL } from '@env'

const fetch = window.fetch.bind(window) as any
const callRelayer = relayerCall.bind({ url: RELAYER_URL, fetch })

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

const fetchNetworks = async () => {
  try {
    const timeout = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 20000)
    })
    const res = await Promise.race([callRelayer('/v2/config/networks'), timeout])
    const networks = Object.values(res.data.extensionConfigNetworks)
    return networks
  } catch (error) {
    console.error('Failed to fetch networks:', error)
    return predefinedNetworks
  }
}

const BenzinNetworksContextProvider: FC<Props> = ({ children }) => {
  const [benzinNetworks, setBenzinNetworks] = useState<Network[]>([])
  const [loadingBenzinNetworks, setLoadingBenzinNetworks] = useState<bigint[]>([])

  useEffect(() => {
    const fetchAndSetNetworks = async () => {
      const networks = (await fetchNetworks()) as Network[]
      setBenzinNetworks(networks)
    }
    fetchAndSetNetworks()
  }, [])

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
