import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React from 'react'
import { View } from 'react-native'

import Spinner from '@modules/common/components/Spinner'
import usePrivateMode from '@modules/common/hooks/usePrivateMode'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import CollectibleItem from './CollectibleItem'
import CollectiblesEmptyState from './CollectiblesEmptyState'
import styles from './styles'

interface Props {
  collectibles: UsePortfolioReturnType['collectibles']
  isCurrNetworkProtocolsLoading: boolean
}

const Collectibles = ({ collectibles, isCurrNetworkProtocolsLoading }: Props) => {
  const { isPrivateMode } = usePrivateMode()

  if (isCurrNetworkProtocolsLoading) {
    return (
      <View style={[flexboxStyles.center, spacings.pbLg]}>
        <Spinner />
      </View>
    )
  }

  if (!collectibles?.length || isPrivateMode) {
    return (
      <CollectiblesEmptyState
        isPrivateMode={isPrivateMode}
        collectiblesLength={collectibles.length || 0}
      />
    )
  }

  return (
    <View style={styles.itemsContainer}>
      {collectibles.map(({ network, address, collectionName, collectionImg, assets }) =>
        (assets || []).map(({ tokenId, assetName, assetImg, balanceUSD }) => (
          <CollectibleItem
            key={tokenId}
            assetImg={assetImg}
            collectionImg={collectionImg}
            collectionName={collectionName}
            assetName={assetName}
            balanceUSD={balanceUSD}
          />
        ))
      )}
    </View>
  )
}

export default React.memo(Collectibles)
