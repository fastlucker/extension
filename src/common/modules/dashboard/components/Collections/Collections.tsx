import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewProps } from 'react-native'

import Text from '@common/components/Text'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import CollectibleModal from './CollectibleModal'
import { SelectedCollectible } from './CollectibleModal/CollectibleModal'
import Collection from './Collection'
import styles from './styles'

const Collections = ({ ...rest }: ViewProps) => {
  const { accountPortfolio } = usePortfolioControllerState()
  const [selectedCollectible, setSelectedCollectible] = useState<SelectedCollectible | null>(null)
  const { t } = useTranslation()
  const closeCollectibleModal = () => {
    setSelectedCollectible(null)
  }

  const openCollectibleModal = (collectible: SelectedCollectible) => {
    setSelectedCollectible(collectible)
  }

  return (
    <View {...rest}>
      <CollectibleModal
        isOpen={!!selectedCollectible}
        handleClose={closeCollectibleModal}
        selectedCollectible={selectedCollectible}
      />
      {accountPortfolio?.collections?.length ? (
        accountPortfolio.collections.map(({ address, name, networkId, collectibles, priceIn }) => (
          <Collection
            address={address}
            networkId={networkId}
            key={address}
            name={name}
            collectibles={collectibles}
            priceIn={priceIn}
            openCollectibleModal={openCollectibleModal}
          />
        ))
      ) : (
        <Text fontSize={16} weight="medium" style={styles.noCollectibles}>
          {t("You don't have any collectibles (NFTs) yet")}
        </Text>
      )}
    </View>
  )
}

export default React.memo(Collections)
