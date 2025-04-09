import React, { useMemo } from 'react'
import { View } from 'react-native'

import spacings from '@common/styles/spacings'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

import NetworkComponent from './Network'

const Networks = ({
  openSettingsBottomSheet,
  openBlockExplorer,
  search,
  onPress
}: {
  openSettingsBottomSheet: (chainId: bigint | string) => void
  openBlockExplorer: (url?: string) => void
  search: string
  onPress: (chainId: bigint | string) => void
}) => {
  const { networks } = useNetworksControllerState()
  const { account, portfolio } = useSelectedAccountControllerState()

  const portfolioByNetworks = useMemo(
    () => (account ? portfolio.latest : {}),
    [account, portfolio.latest]
  )

  const filteredAndSortedPortfolio = useMemo(
    () =>
      Object.keys(portfolioByNetworks || [])
        .filter((chainId) => {
          const { name } =
            networks.find(({ chainId: nChainId }) => chainId === nChainId.toString()) || {}

          if (!name) return false

          if (search) {
            return name.toLowerCase().includes(search.toLowerCase())
          }

          return true
        })
        .sort((a, b) => {
          const aBalance = portfolioByNetworks[a]?.result?.total?.usd || 0
          const bBalance = portfolioByNetworks[b]?.result?.total?.usd || 0

          if (aBalance === bBalance) {
            if (b === 'rewards' || b === 'gasTank') return -1
            return 1
          }

          return Number(bBalance) - Number(aBalance)
        }),
    [networks, portfolioByNetworks, search]
  )

  return (
    <View style={spacings.mbLg}>
      {!!account &&
        filteredAndSortedPortfolio.map((chainId) => (
          <NetworkComponent
            key={chainId}
            chainId={chainId}
            openBlockExplorer={openBlockExplorer}
            openSettingsBottomSheet={openSettingsBottomSheet}
            onPress={onPress}
          />
        ))}
    </View>
  )
}

export default React.memo(Networks)
