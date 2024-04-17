import React, { FC, useState } from 'react'
import { Animated, Pressable, View } from 'react-native'

import { Collectible as CollectibleType } from '@ambire-common/libs/portfolio/interfaces'
import Spinner from '@common/components/Spinner'
import useTheme from '@common/hooks/useTheme'
import { SelectedCollectible } from '@common/modules/dashboard/components/Collections/CollectibleModal/CollectibleModal'
import { formatCollectiblePrice } from '@common/modules/dashboard/components/Collections/Collection/Collection'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import ImageIcon from '@web/assets/svg/ImageIcon'
import { useCustomHover } from '@web/hooks/useHover'

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

const Collectible: FC<Props> = ({ id, url, collectionData, openCollectibleModal }) => {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [imageFailed, setImageFailed] = useState(false)
  const urlFormatted = url.startsWith('data:application')
    ? url
    : `https://nftcdn.ambire.com/proxy?url=${url}`

  const [bindAnim, animStyle] = useCustomHover({
    property: 'scaleX',
    values: {
      from: 1,
      to: 1.15
    }
  })

  return (
    <Pressable
      style={[
        styles.container,
        imageFailed || isLoading
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
          name: `${collectionData.name} #${id}`,
          networkId: collectionData.networkId,
          lastPrice: collectionData.priceIn ? formatCollectiblePrice(collectionData.priceIn) : '',
          image: imageFailed ? '' : urlFormatted,
          collectionName: collectionData.name
        })
      }}
      {...bindAnim}
    >
      {({ hovered }: any) =>
        !imageFailed ? (
          <>
            <Animated.Image
              onError={() => setImageFailed(true)}
              onLoadEnd={() => setIsLoading(false)}
              source={{
                uri: urlFormatted
              }}
              style={[
                styles.image,
                {
                  transform: [{ scale: animStyle.scaleX as number }]
                }
              ]}
            />
            {isLoading && (
              <View
                style={{
                  ...styles.image,
                  ...flexbox.center,
                  backgroundColor: theme.primaryBackground,
                  // Display it over the image while loading
                  zIndex: 3
                }}
              >
                <Spinner
                  style={{
                    width: 24,
                    height: 24
                  }}
                />
              </View>
            )}
          </>
        ) : (
          <ImageIcon
            color={theme.secondaryText}
            width={COLLECTIBLE_SIZE / (hovered ? 1.85 : 2)}
            height={COLLECTIBLE_SIZE / (hovered ? 1.85 : 2)}
          />
        )
      }
    </Pressable>
  )
}

export default React.memo(Collectible)
