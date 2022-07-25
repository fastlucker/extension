import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React from 'react'
import { Image, View } from 'react-native'

import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import CollectiblesEmptyState from './CollectiblesEmptyState'
import styles from './styles'

interface Props {
  collectibles: UsePortfolioReturnType['collectibles']
}

const Collectibles = ({ collectibles }: Props) => {
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

  if (!collectibles?.length) {
    return <CollectiblesEmptyState />
  }

  return (
    <View style={styles.itemsContainer}>
      {collectibles.map(({ network, address, collectionName, collectionImg, assets }) =>
        (assets || []).map(({ tokenId, assetName, assetImg, balanceUSD }) => (
          <View style={styles.itemWrapper} key={tokenId}>
            <View style={styles.item}>
              <Image style={styles.collectibleImage} source={{ uri: handleUri(assetImg) }} />
              <View style={[spacings.phTy, spacings.pbTy]}>
                <View
                  style={[
                    flexboxStyles.directionRow,
                    flexboxStyles.alignCenter,
                    flexboxStyles.flex1
                  ]}
                >
                  <Image
                    style={styles.collectionImage}
                    source={{ uri: handleUri(collectionImg) }}
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
        ))
      )}
    </View>
  )
}

export default Collectibles
