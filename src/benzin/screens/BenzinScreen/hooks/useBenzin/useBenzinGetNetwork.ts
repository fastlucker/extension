import { useCallback, useEffect, useRef, useState } from 'react'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
import { Network } from '@ambire-common/interfaces/network'
import { ChainlistNetwork } from '@benzin/screens/BenzinScreen/interfaces/networks'
import { convertToAmbireNetworkFormat } from '@benzin/screens/BenzinScreen/utils/networks'
import useToast from '@common/hooks/useToast'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

interface Props {
  chainId: string | null
}

const useBenzinGetNetwork = ({ chainId }: Props) => {
  const { addToast } = useToast()
  const { networks: settingsNetworks } = useNetworksControllerState()

  const networks = settingsNetworks ?? constantNetworks
  const [network, setNetwork] = useState<Network | null>(
    networks.find((n) => n.chainId === BigInt(Number(chainId))) || null
  )
  const [isNetworkLoading, setIsNetworkLoading] = useState(true)

  const isMounted = useRef(true)

  const fetchNetworkData = useCallback(async () => {
    try {
      const chainsRequest = await fetch('https://chainid.network/chains.json')
      const chains = await chainsRequest.json()

      const networkDataInChainlistNetworkFormat = chains.find(
        (chainlistNetwork: ChainlistNetwork) => chainlistNetwork.chainId === Number(chainId)
      )

      if (!networkDataInChainlistNetworkFormat || !isMounted.current) return

      const networkDataInAmbireNetworkFormat = await convertToAmbireNetworkFormat(
        networkDataInChainlistNetworkFormat
      )
      setNetwork(networkDataInAmbireNetworkFormat)
    } catch (error) {
      console.error(error)
      addToast('Error fetching network data', { type: 'error' })
    } finally {
      setIsNetworkLoading(false)
    }
  }, [addToast, chainId])

  useEffect(() => {
    isMounted.current = true
    if (!!network || !chainId) {
      setIsNetworkLoading(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchNetworkData()

    return () => {
      isMounted.current = false
    }
  }, [addToast, chainId, fetchNetworkData, network])

  return {
    network,
    isNetworkLoading
  }
}

export default useBenzinGetNetwork
