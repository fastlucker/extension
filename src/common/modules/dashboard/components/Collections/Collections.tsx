import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewProps } from 'react-native'

import Text from '@common/components/Text'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Collection from './Collection'
import styles from './styles'

const Collections = ({ ...rest }: ViewProps) => {
  const { accountPortfolio } = usePortfolioControllerState()
  const { t } = useTranslation()

  return (
    <View {...rest}>
      {accountPortfolio?.collections && accountPortfolio.collections.length > 0 ? (
        accountPortfolio.collections.map(({ address, name, networkId, collectibles, priceIn }) => (
          <Collection
            address={address}
            networkId={networkId}
            key={address}
            name={name}
            collectibles={collectibles}
            priceIn={priceIn}
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
