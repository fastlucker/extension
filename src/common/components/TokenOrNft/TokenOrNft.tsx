import React, { FC, memo, useMemo } from 'react'
import { View } from 'react-native'

import { extraNetworks, networks as hardcodedNetwork } from '@ambire-common/consts/networks'
import { Network, NetworkId } from '@ambire-common/interfaces/network'
import Address from '@common/components/Address'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import useAssetInfo from '@common/hooks/useAssetInfo'
import spacings, { SPACING_TY } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

import Nft from './components/Nft'
import Token from './components/Token'

interface Props {
  address: string
  value: bigint
  sizeMultiplierSize?: number
  textSize?: number
  networkId?: NetworkId
}

const TokenOrNft: FC<Props> = ({
  value,
  address,
  textSize = 16,
  networkId,
  sizeMultiplierSize = 1
}) => {
  const marginRight = SPACING_TY * sizeMultiplierSize

  const { networks: stateNetworks } = useNetworksControllerState()
  // @TODO fix
  const networks: Network[] = useMemo(
    () => [...(stateNetworks || hardcodedNetwork), ...(extraNetworks as Network[])],
    [stateNetworks]
  )
  const network = useMemo(() => networks.find((n) => n.id === networkId), [networks, networkId])
  // @TODO
  const {assetInfo} = useAssetInfo({ address, network: network || networks[0] })

  return (
    <View style={{ ...flexbox.directionRow, ...flexbox.alignCenter, marginRight }}>
      {!network ? (
        <>
          <Address address={address} />
          <Text style={spacings.mlTy}>on {networkId}</Text>
        </>
      ) : !assetInfo.isLoading && assetInfo?.type ==='ERC-721' ? (
        <Nft
          address={address}
          network={network}
          networks={networks}
          tokenId={value}
          nftInfo={{name: assetInfo.name}}
        />
      ) : !assetInfo.isLoading  ? (
        <Token
          textSize={textSize}
          network={network}
          address={address}
          amount={value}
          tokenInfo={assetInfo}
        />
      ) : (
        <SkeletonLoader width={140} height={24} appearance="tertiaryBackground" />
      )}
    </View>
  )
}

export default memo(TokenOrNft)
