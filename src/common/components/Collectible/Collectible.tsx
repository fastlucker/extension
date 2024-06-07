import React, { FC } from 'react'
import { Animated, Pressable, View } from 'react-native'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
import useTheme from '@common/hooks/useTheme'
import { SelectedCollectible } from '@common/modules/dashboard/components/Collections/CollectibleModal/CollectibleModal'
import { formatCollectiblePrice } from '@common/modules/dashboard/components/Collections/Collection/Collection'
import flexbox from '@common/styles/utils/flexbox'
import { NFT_CDN_URL } from '@env'
import ImageIcon from '@web/assets/svg/ImageIcon'
import ManifestImage from '@web/components/ManifestImage'
import { useCustomHover } from '@web/hooks/useHover'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import styles, { COLLECTIBLE_SIZE } from './styles'

type Props = {
  id: bigint
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
  size?: number
}

const Collectible: FC<Props> = ({ id, collectionData, openCollectibleModal, size }) => {
  const { theme } = useTheme()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'scaleX',
    values: {
      from: 1,
      to: 1.15
    }
  })
  const { networks: settingsNetworks } = useSettingsControllerState()
  const networks = settingsNetworks ?? constantNetworks
  const network = networks.find((n) => n.id === collectionData.networkId)

  const imageUrl = `${NFT_CDN_URL}/proxy?rpc=${network?.rpcUrls[0]}&contract=${collectionData.address}&id=${id}`

  return (
    <Pressable
      testID="collectible-picture"
      style={{ width: size || COLLECTIBLE_SIZE, height: size || COLLECTIBLE_SIZE }}
      onPress={() => {
        openCollectibleModal({
          address: collectionData.address,
          name: `${collectionData.name} #${id}`,
          networkId: collectionData.networkId,
          lastPrice: collectionData.priceIn ? formatCollectiblePrice(collectionData.priceIn) : '',
          image: imageUrl,
          collectionName: collectionData.name
        })
      }}
      {...bindAnim}
    >
      <Animated.View
        style={[flexbox.flex1, { transform: [{ scale: animStyle.scaleX as number }] }]}
      >
        <ManifestImage
          uri={imageUrl}
          size="100%"
          skeletonProps={{
            appearance: 'primaryBackground'
          }}
          fallback={() => (
            <View
              style={[
                flexbox.flex1,
                flexbox.center,
                { backgroundColor: theme.primaryBackground, width: '100%' }
              ]}
            >
              <ImageIcon
                color={theme.secondaryText}
                width={COLLECTIBLE_SIZE / 2}
                height={COLLECTIBLE_SIZE / 2}
              />
            </View>
          )}
          imageStyle={styles.image}
        />
      </Animated.View>
    </Pressable>
  )
}

export default React.memo(Collectible)
