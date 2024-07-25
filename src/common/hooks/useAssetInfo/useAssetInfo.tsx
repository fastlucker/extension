import { getAddress } from 'ethers'
import { useEffect, useMemo } from 'react'

import { Network } from '@ambire-common/interfaces/network'
import useAssetInfoControllerState from '@web/hooks/useAssetInfoController'
import useBackgroundService from '@web/hooks/useBackgroundService'

interface Props {
  address: string
  network: Network
}

const useAssetInfo = ({
  address,
  network
}: Props): {
  tokenInfo?: { decimals: number; symbol: string }
  nftInfo?: { name: string }
  isLoading?: boolean
} => {
  const checksummedAddress = getAddress(address)
  const { dispatch } = useBackgroundService()

  const { assetInfos } = useAssetInfoControllerState()

  const { tokenInfo, nftInfo, isLoading } = useMemo(() => {
    const assetInfo = assetInfos[`${getAddress(address)}:${network.id}`]
    if (!assetInfo) return { isLoading: true }
    if (assetInfo.type === 'ERC-20') {
      return { tokenInfo: { decimals: assetInfo.decimals, symbol: assetInfo.symbol } }
    }
    if (assetInfo.type === 'ERC-721') {
      return { nftInfo: { name: assetInfo.name } }
    }
    return { isLoading: true }
  }, [assetInfos, network.id, address])

  useEffect(() => {
    const isKnown = nftInfo || tokenInfo
    if (!checksummedAddress || isKnown) return
    dispatch({
      type: 'ASSET_INFO_CONTROLLER_LOOKUP',
      params: {
        address: checksummedAddress,
        network
      }
    })
  }, [checksummedAddress, network, dispatch, isLoading, nftInfo, tokenInfo])

  return {
    tokenInfo,
    nftInfo,
    isLoading
  }
}

export default useAssetInfo
