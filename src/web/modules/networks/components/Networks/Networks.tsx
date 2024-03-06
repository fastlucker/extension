import React, { useMemo } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import spacings from '@common/styles/spacings'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Network from './Network'

const Networks = ({
  openSettingsBottomSheet,
  openBlockExplorer,
  filterByNetworkId
}: {
  openSettingsBottomSheet: (networkId: NetworkDescriptor['id']) => void
  openBlockExplorer: (url?: string) => void
  filterByNetworkId: NetworkDescriptor['id'] | null
}) => {
  const { selectedAccount } = useMainControllerState()
  const portfolioControllerState = usePortfolioControllerState()

  const portfolioByNetworks = useMemo(
    () => (selectedAccount ? portfolioControllerState.state.latest[selectedAccount] : {}),
    [selectedAccount, portfolioControllerState.state.latest]
  )

  const filteredAndSortedPortfolio = useMemo(
    () =>
      Object.keys(portfolioByNetworks || []).sort((a, b) => {
        const aBalance = portfolioByNetworks[a]?.result?.total?.usd || 0
        const bBalance = portfolioByNetworks[b]?.result?.total?.usd || 0

        if (aBalance === bBalance) {
          if (b === 'rewards' || b === 'gasTank') return -1
          return 1
        }

        return Number(bBalance) - Number(aBalance)
      }),
    [portfolioByNetworks]
  )

  return (
    <View style={spacings.mbLg}>
      {!!selectedAccount &&
        filteredAndSortedPortfolio.map((networkId) => (
          <Network
            key={networkId}
            networkId={networkId}
            filterByNetworkId={filterByNetworkId}
            openBlockExplorer={openBlockExplorer}
            openSettingsBottomSheet={openSettingsBottomSheet}
          />
        ))}
    </View>
  )
}

export default Networks
