import { getAddress } from 'ethers'
import { useEffect } from 'react'

import { Network } from '@ambire-common/interfaces/network'
import useAssetInfoControllerState from '@web/hooks/useAssetInfoController'
import useBackgroundService from '@web/hooks/useBackgroundService'

interface Props {
  address: string
  network: Network
}

const useAssetInfo = ({ address, network }: Props) => {
  const checksummedAddress = getAddress(address)
  const { dispatch } = useBackgroundService()
  // @TODO proper loading implementation
  const { assetInfos } = useAssetInfoControllerState()
  const assetInfo = assetInfos[`${getAddress(address)}:${network.id}`] || {}
  useEffect(() => {
    if (!checksummedAddress || assetInfo?.isLoading) return

    dispatch({
      type: 'ASSET_INFO_CONTROLLER_LOOKUP',
      params: {
        address: checksummedAddress,
        network
      }
    })
  }, [checksummedAddress, network, dispatch, assetInfo])

  return {
    assetInfo
  }
}

export default useAssetInfo
