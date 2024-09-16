import React, { FC, memo, useCallback, useState } from 'react'
import { View, ViewStyle } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { Network } from '@ambire-common/interfaces/network'
import Address from '@common/components/Address'
import Collectible from '@common/components/Collectible'
import CollectibleModal, { SelectedCollectible } from '@common/components/CollectibleModal'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Props {
  tokenId: bigint
  textSize?: number
  network: Network
  networks: Network[]
  address: string
  nftInfo: { name: string }
  hideSendNft?: boolean
  style?: ViewStyle
}

const Nft: FC<Props> = ({
  address,
  tokenId,
  textSize = 16,
  network,
  networks,
  nftInfo,
  hideSendNft,
  style
}) => {
  const { ref: modalRef, open: openModal, close: closeModal } = useModalize()
  const [collectibleData, setCollectibleData] = useState<SelectedCollectible | null>(null)

  const openCollectibleModal = useCallback(
    (collectible: SelectedCollectible) => {
      setCollectibleData(collectible)
      openModal()
    },
    [openModal]
  )

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.wrap, style]}>
      <Collectible
        style={spacings.mhTy}
        size={36}
        id={tokenId}
        collectionData={{
          name: nftInfo?.name || 'Unknown NFT',
          address,
          networkId: network.id
        }}
        openCollectibleModal={openCollectibleModal}
        networks={networks}
      />
      <CollectibleModal
        modalRef={modalRef}
        handleClose={closeModal}
        selectedCollectible={collectibleData}
        hideSendNft={hideSendNft}
      />
      <View style={[spacings.mrTy]}>
        <Address
          fontSize={textSize}
          address={address}
          highestPriorityAlias={`${nftInfo?.name || 'NFT'} #${tokenId}`}
          explorerNetworkId={network.id}
        />
      </View>
    </View>
  )
}

export default memo(Nft)
