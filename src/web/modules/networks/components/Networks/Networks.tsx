import React, { useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { formatThousands } from '@common/modules/dashboard/helpers/getTokenDetails'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import getStyles from '@web/modules/networks/screens/styles'

const Networks = ({
  openSettingsBottomSheet,
  openBlockExplorer,
  filterByNetworkId
}: {
  openSettingsBottomSheet: (networkId: NetworkDescriptor['id']) => void
  openBlockExplorer: (url?: string) => void
  filterByNetworkId: NetworkDescriptor['id'] | null
}) => {
  const { navigate } = useNavigation()
  const { theme, styles } = useTheme(getStyles)
  const { networks } = useSettingsControllerState()
  const { selectedAccount } = useMainControllerState()
  const portfolioControllerState = usePortfolioControllerState()
  const [hoveredNetworkId, setHoveredNetworkId] = useState<string | null>(null)

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

  const navigateAndFilterDashboard = (networkId: NetworkDescriptor['id']) => {
    navigate(WEB_ROUTES.dashboard, {
      state: {
        filterByNetworkId: networkId
      }
    })
  }

  return (
    <View style={spacings.mbLg}>
      {!!selectedAccount &&
        filteredAndSortedPortfolio.map((networkId) => {
          const networkData = networks.find((network) => network.id === networkId)
          const networkBalance = portfolioByNetworks[networkId]?.result?.total
          const isNetworkHovered = hoveredNetworkId === networkId
          const isInternalNetwork = networkId === 'rewards' || networkId === 'gasTank'
          let networkName = networkData?.name

          if (networkId === 'rewards') {
            networkName = 'Ambire Rewards'
          } else if (networkId === 'gasTank') {
            networkName = 'Gas Tank'
          }

          return (
            <Pressable
              key={networkId}
              onHoverIn={() => setHoveredNetworkId(networkId)}
              onHoverOut={() => setHoveredNetworkId(null)}
              onPress={() => navigateAndFilterDashboard(networkId)}
              style={[
                styles.network,
                isInternalNetwork ? styles.noKebabNetwork : {},
                filterByNetworkId === networkId || isNetworkHovered ? styles.highlightedNetwork : {}
              ]}
            >
              <View style={[flexbox.alignCenter, flexbox.directionRow]}>
                {/* @ts-ignore */}
                <NetworkIcon width={32} height={32} name={networkId} />
                <Text style={spacings.mlMi} fontSize={16}>
                  {networkName}
                </Text>
                {!isInternalNetwork && (
                  <Pressable
                    onPress={async () => {
                      await openBlockExplorer(networkData?.explorerUrl)
                    }}
                    style={[
                      spacings.mlSm,
                      {
                        opacity: filterByNetworkId === networkId || isNetworkHovered ? 1 : 0
                      }
                    ]}
                    onHoverIn={() => setHoveredNetworkId(networkId)}
                  >
                    {({ hovered }: any) => (
                      <OpenIcon
                        width={16}
                        height={16}
                        color={hovered ? theme.primaryText : theme.secondaryText}
                      />
                    )}
                  </Pressable>
                )}
              </View>
              <View style={[flexbox.alignCenter, flexbox.directionRow]}>
                <Text fontSize={filterByNetworkId === networkId ? 20 : 16} weight="semiBold">
                  {`$${formatThousands(Number(networkBalance?.usd || 0).toFixed(2))}` || '$-'}
                </Text>
                {!isInternalNetwork && (
                  <Pressable
                    onHoverIn={() => setHoveredNetworkId(networkId)}
                    onPress={() => openSettingsBottomSheet(networkId)}
                    style={spacings.mlSm}
                  >
                    {({ hovered }: any) => (
                      <KebabMenuIcon
                        width={16}
                        height={16}
                        color={hovered ? theme.primaryText : theme.secondaryText}
                      />
                    )}
                  </Pressable>
                )}
              </View>
            </Pressable>
          )
        })}
    </View>
  )
}

export default Networks
