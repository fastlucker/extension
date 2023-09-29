import { View } from 'react-native'

import Text from '@common/components/Text'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Collection from './Collection'
import styles from './styles'

const Collections = () => {
  const { accountPortfolio } = usePortfolioControllerState()

  return (
    <View>
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
          You don&apos;t have any collectibles (NFTs) yet
        </Text>
      )}
    </View>
  )
}

export default Collections
