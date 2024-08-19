import React, { FC, memo } from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import Address from '@common/components/Address'
import Collectible from '@common/components/Collectible'
import spacings from '@common/styles/spacings'

interface Props {
  tokenId: bigint
  textSize?: number
  network: Network
  networks: Network[]
  address: string
  nftInfo: { name: string }
}

const Nft: FC<Props> = ({ address, tokenId, textSize = 16, network, networks, nftInfo }) => {
  return (
    <>
      <Collectible
        style={spacings.mhTy}
        size={36}
        id={tokenId}
        collectionData={{
          address,
          networkId: network.id
        }}
        networks={networks}
      />
      <View style={[spacings.mrTy]}>
        <Address
          fontSize={textSize}
          address={address}
          highestPriorityAlias={`${nftInfo?.name || 'NFT'} #${tokenId}`}
          explorerNetworkId={network.id}
        />
      </View>
    </>
  )
}

export default memo(Nft)
