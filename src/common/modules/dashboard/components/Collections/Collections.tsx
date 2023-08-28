import { View } from 'react-native'

import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Collection from './Collection'

const Collections = () => {
  const { accountPortfolio } = usePortfolioControllerState()

  return (
    <View>
      {accountPortfolio.collections.map(({ address, name, networkId, collectibles }) => (
        <Collection
          address={address}
          networkId={networkId}
          key={address}
          name={name}
          collectibles={collectibles}
        />
      ))}
    </View>
  )
}

export default Collections
