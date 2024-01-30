import React, { FC, useState } from 'react'
import { Image, Pressable, View } from 'react-native'

import { Collectible as CollectibleType } from '@ambire-common/libs/portfolio/interfaces'
import useNft from '@common/hooks/useNft'
import useTheme from '@common/hooks/useTheme'
import { SelectedCollectible } from '@common/modules/dashboard/components/Collections/CollectibleModal/CollectibleModal'
import { formatCollectiblePrice } from '@common/modules/dashboard/components/Collections/Collection/Collection'
import ImageIcon from '@web/assets/svg/ImageIcon'

import styles, { COLLECTIBLE_SIZE } from './styles'

type Props = CollectibleType & {
  collectionData: {
    name: string
    address: string
    networkId: string
    priceIn: {
      baseCurrency: string
      price: number
    } | null
  }
  openCollectibleModal: (collectible: SelectedCollectible) => void
}

const Collectible: FC<Props> = ({ id, collectionData, openCollectibleModal }) => {
  const { theme } = useTheme()
  const [imageFailed, setImageFailed] = useState(false)
  const { data, error, isLoading } = useNft({
    id,
    address: collectionData.address,
    networkId: collectionData.networkId
  })

  // Works like a skeleton loader while the collectible is being fetched.
  if (isLoading) return <View style={[styles.container, { backgroundColor: theme.backdrop }]} />

  if (!data && !error) return null

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        openCollectibleModal({
          address: collectionData.address,
          name: data?.name || '',
          networkId: collectionData.networkId,
          lastPrice: collectionData.priceIn ? formatCollectiblePrice(collectionData.priceIn) : '',
          image: data?.image || '',
          collectionName: collectionData.name
        })
      }}
    >
      {({ hovered }: any) => (
        <>
          {!error && data?.image && !imageFailed && (
            <Image
              onError={() => setImageFailed(true)}
              source={{ uri: data.image }}
              style={[
                styles.image,
                {
                  transform: [{ scale: hovered ? 1.15 : 1 }]
                }
              ]}
            />
          )}
          {(error || imageFailed || !data?.image) && (
            <ImageIcon width={COLLECTIBLE_SIZE} height={COLLECTIBLE_SIZE} />
          )}
        </>
      )}
    </Pressable>
  )
}

export default Collectible
