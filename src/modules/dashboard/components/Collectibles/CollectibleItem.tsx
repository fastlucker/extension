import React, { useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import handleCollectibleUri from '@modules/dashboard/helpers/handleCollectibleUri'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

type Props = {
  tokenId: string
  network: string
  address: string
  assetImg: string
  collectionImg: string
  collectionName: string
  assetName: string
  balanceUSD: number
}

const CollectibleItem = ({
  tokenId,
  network,
  address,
  assetImg,
  collectionImg,
  collectionName,
  assetName,
  balanceUSD,
}: Props) => {
  const [isAssetImageLoading, setIsAssetImageLoading] = useState(true)
  const { navigate } = useNavigation()

  const handleCollectiblePress = () => {
    navigate('collectible-screen', {
      tokenId,
      network,
      address,
    })
  }

  return (
    <View style={styles.itemWrapper}>
      <TouchableOpacity style={styles.item} activeOpacity={0.6} onPress={handleCollectiblePress}>
        {isAssetImageLoading ? (
          <View style={styles.collectibleImageLoadingWrapper}>
            <Spinner />
          </View>
        ) : (
          <Image style={styles.collectibleImage} source={{ uri: handleCollectibleUri(assetImg) }} />
        )}
        <View style={[spacings.phTy, spacings.pbTy]}>
          <View
            style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, flexboxStyles.flex1]}
          >
            <Image
              style={styles.collectionImage}
              source={{ uri: handleCollectibleUri(collectionImg) }}
              onLoad={() => setIsAssetImageLoading(false)}
              onError={() => setIsAssetImageLoading(false)}
            />

            <Text numberOfLines={1} style={flexboxStyles.flex1} fontSize={10}>
              {collectionName}
            </Text>
          </View>
          <View
            style={[
              flexboxStyles.directionRow,
              spacings.ptMi,
              flexboxStyles.flex1,
              flexboxStyles.alignCenter,
            ]}
          >
            <Text
              numberOfLines={1}
              weight="regular"
              fontSize={11}
              style={[flexboxStyles.flex1, spacings.mrMi]}
            >
              {assetName}
            </Text>
            <Text fontSize={10}>
              <Text fontSize={10} color={colors.heliotrope}>
                $
              </Text>
              <Text fontSize={10}>{balanceUSD.toFixed(2)}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default React.memo(CollectibleItem)
