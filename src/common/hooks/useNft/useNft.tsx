import { Contract } from 'ethers'
import { useEffect, useState } from 'react'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { CustomNetwork, NetworkPreference } from '@ambire-common/interfaces/settings'
import { getRpcProvider } from '@ambire-common/services/provider'
import ERC721ABI from '@contracts/compiled/IERC721.json'

import fetchCollectible from './helpers/fetchCollectible'
import getImageUrlFromAmbireCdn from './helpers/getImageUrlFromAmbireCdn'
import getUrlWithIpfsGateway from './helpers/getUrlWithIpfsGateway'
import { CollectibleData } from './types'

interface Props {
  address: string
  network: NetworkDescriptor & (NetworkPreference | CustomNetwork)
  id: bigint
}

interface ReturnInterface {
  data: CollectibleData | null
  error: boolean
  isLoading: boolean
}

interface MaybeUri {
  uri?: string
  err?: string
}

const useNft = ({ address, network, id }: Props): ReturnInterface => {
  const [error, setError] = useState(false)
  const [data, setData] = useState<CollectibleData | null>(null)

  useEffect(() => {
    const provider = getRpcProvider(network.rpcUrls, network.chainId)
    const contract = new Contract(address, ERC721ABI.abi, provider)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.all([
      contract.ownerOf(id).catch(() => ''),
      contract
        .tokenURI(id)
        .then((uri: string): MaybeUri => ({ uri }))
        .catch((err: string): MaybeUri => ({ err })),
      contract
        .uri(id)
        .then((uri: string): MaybeUri => ({ uri }))
        .catch((err: string): MaybeUri => ({ err }))
    ])
      .then(([owner, maybeUri1, maybeUri2]) => {
        const url = maybeUri1?.uri || maybeUri2?.uri

        if (!url) throw new Error('Failed to fetch collectible')

        const urlWithGateway = getUrlWithIpfsGateway(url)

        fetchCollectible(urlWithGateway)
          .then(async (fetchedData: CollectibleData | null) => {
            if (!fetchedData) throw new Error('Failed to fetch collectible')
            let imageUri = getImageUrlFromAmbireCdn(url)

            if (!imageUri) {
              imageUri = getUrlWithIpfsGateway(fetchedData.image)
            }

            setData({
              ...fetchedData,
              image: imageUri,
              owner
            })
          })
          .catch(() => {
            setData(null)
            setError(true)
          })
      })
      .catch(() => {
        setData(null)
        setError(true)
      })
    provider?.destroy()
    return () => {
      provider?.destroy()
    }
  }, [address, id, network])

  return { data, error, isLoading: !data && !error }
}

export default useNft
