import React, { FC, useMemo, useState } from 'react'
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
  const [bindAnim, animStyle] = useCustomHover({
    property: 'scaleX',
    values: {
      from: 1,
      to: 1.15
    }
  })

  const imageUrl = useMemo(() => {
    // Ambire's NFT CDN can't handle base64 json data
    if (url.startsWith('data:application')) {
      try {
        // Convert base64 to json
        const json = Buffer.from(url.substring(29), 'base64').toString()
        const result = JSON.parse(json)

        // Add a proxy if the image is IPFS
        if (result.image.startsWith('ipfs://')) {
          return `https://ipfs.io/ipfs/${result.image.substring(7)}`
        }

        return result.image
      } catch {
        // imageFailed will be set by the onError event
        return ''
      }
    }

    // Resolves to an image from a JSON source
    return `https://nftcdn.ambire.com/proxy?url=${url}`
  }, [url])

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
          image: imageFailed ? '' : imageUrl,
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
                uri: imageUrl
              }}
              style={[
                styles.image,
                {
                  transform: [{ scale: animStyle.scaleX as number }]
                }
              ]}
              resizeMode="contain"
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
