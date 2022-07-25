import React, { useState } from 'react'
import { Image, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  assetImg: string
  collectionImg: string
  collectionName: string
  assetName: string
  balanceUSD: number
}

const CollectibleItem = ({
  assetImg,
  collectionImg,
  collectionName,
  assetName,
  balanceUSD
}: Props) => {
  const [isAssetImageLoading, setIsAssetImageLoading] = useState(true)
  const handleUri = (uri: string) => {
    if (!uri) return ''
    // eslint-disable-next-line no-param-reassign
    uri = uri.startsWith('data:application/json')
      ? uri.replace('data:application/json;utf8,', '')
      : uri

    if (uri.split('/')[0] === 'data:image') return uri
    if (uri.startsWith('ipfs://'))
      return uri.replace(/ipfs:\/\/ipfs\/|ipfs:\/\//g, 'https://ipfs.io/ipfs/')
    if (uri.split('/')[2].endsWith('mypinata.cloud'))
      return `https://ipfs.io/ipfs/${uri.split('/').slice(4).join('/')}`

    return uri
  }

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.item}>
        {isAssetImageLoading ? (
          <View style={styles.collectibleImageLoadingWrapper}>
            <Spinner />
          </View>
        ) : (
          <FastImage style={styles.collectibleImage} source={{ uri: handleUri(assetImg) }} />
        )}
        <View style={[spacings.phTy, spacings.pbTy]}>
          <View
            style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, flexboxStyles.flex1]}
          >
            <Image
              style={styles.collectionImage}
              source={{ uri: handleUri(collectionImg) }}
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
              flexboxStyles.alignCenter
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
      </View>
    </View>
  )
}

export default React.memo(CollectibleItem)
