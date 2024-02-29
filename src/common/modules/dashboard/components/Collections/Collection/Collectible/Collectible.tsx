import React, { FC, useState } from 'react'
import { Animated, Pressable, View } from 'react-native'

import { Collectible as CollectibleType } from '@ambire-common/libs/portfolio/interfaces'
import useNft from '@common/hooks/useNft'
import useTheme from '@common/hooks/useTheme'
import { SelectedCollectible } from '@common/modules/dashboard/components/Collections/CollectibleModal/CollectibleModal'
import { formatCollectiblePrice } from '@common/modules/dashboard/components/Collections/Collection/Collection'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import ImageIcon from '@web/assets/svg/ImageIcon'
import { DURATIONS, useCustomHover } from '@web/hooks/useHover'

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
  const [bindAnim, animStyle] = useCustomHover({
    property: 'scaleX',
    values: {
      from: 1,
      to: 1.15
    },
    duration: DURATIONS.FAST
  })
  const renderFallbackImage = error || imageFailed || !data?.image

  // Works like a skeleton loader while the collectible is being fetched.
  if (isLoading) return <View style={[styles.container, { backgroundColor: theme.backdrop }]} />

  if (!data && !error) return null

  return (
    <Pressable
      style={[
        styles.container,
        renderFallbackImage
          ? {
              backgroundColor: theme.primaryBackground,
              borderRadius: BORDER_RADIUS_PRIMARY,
              ...flexbox.center
            }
          : {}
      ]}
      onPress={() => {
        openCollectibleModal({
          address: collectionData.address,
          name: data?.name || '',
          networkId: collectionData.networkId,
          lastPrice: collectionData.priceIn ? formatCollectiblePrice(collectionData.priceIn) : '',
          image: !data?.image || imageFailed ? '' : data?.image,
          collectionName: collectionData.name
        })
      }}
      {...bindAnim}
    >
      {({ hovered }: any) => (
        <>
          {!error && data?.image && !imageFailed && (
            <Animated.Image
              onError={() => setImageFailed(true)}
              source={{ uri: data.image }}
              style={[
                styles.image,
                {
                  transform: [{ scale: animStyle.scaleX as number }]
                }
              ]}
            />
          )}
          {!!renderFallbackImage && (
            <ImageIcon
              color={theme.secondaryText}
              width={COLLECTIBLE_SIZE / (hovered ? 1.85 : 2)}
              height={COLLECTIBLE_SIZE / (hovered ? 1.85 : 2)}
            />
          )}
        </>
      )}
    </Pressable>
  )
}

export default React.memo(Collectible)
