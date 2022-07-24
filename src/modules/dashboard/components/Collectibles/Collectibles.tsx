import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React from 'react'
import { Image, View } from 'react-native'

import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import CollectiblesEmptyState from './CollectiblesEmptyState'
import styles from './styles'

interface Props {
  collectibles: UsePortfolioReturnType['collectibles']
}

const Collectibles = ({ collectibles }: Props) => {
  const handleUri = (uri) => {
    if (!uri) return ''
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
          <View style={styles.item} key={tokenId}>
            <View style={[commonStyles.borderRadiusPrimary, commonStyles.hidden]}>
              <Image style={styles.collectibleImage} source={{ uri: handleUri(assetImg) }} />
              <View>
                <View style={flexboxStyles.directionRow}>
                  {/* <div
                className="collection-icon"
                style={{ backgroundImage: `url(${collectionImg})` }}
              /> */}
                  <Text>{collectionName}</Text>
                </View>
                {/* <div className="details">
                <div className="name">{assetName}</div>
                <div className="value">
                  <span className="purple-highlight">$</span> {balanceUSD.toFixed(2)}
                </div>
              </div> */}
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  )
}

export default Collectibles
