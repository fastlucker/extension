import React, { useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import { formatThousands } from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import getStyles from '@web/modules/networks/screens/styles'

const Networks = ({
  search,
  openSettingsBottomSheet,
  openBlockExplorer
}: {
  search: string
  openSettingsBottomSheet: (networkId: NetworkDescriptor['id']) => void
  openBlockExplorer: (networkId: NetworkDescriptor['id'], url?: string) => void
}) => {
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
      Object.keys(portfolioByNetworks || [])
        .filter((networkId) => {
          if (!search) return true
          const networkData = networks.find((network) => network.id === networkId)
          let networkName = networkData?.name
          if (networkId === 'rewards') {
            networkName = 'Ambire Rewards'
          }
          if (networkId === 'gasTank') {
            networkName = 'Gas Tank'
          }

          return networkName?.toLowerCase().includes(search.toLowerCase())
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
      {!!selectedAccount &&
        filteredAndSortedPortfolio.map((networkId) => {
          const networkData = networks.find((network) => network.id === networkId)
          const networkBalance = portfolioByNetworks[networkId]?.result?.total
          const isNetworkHovered = hoveredNetworkId === networkId
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
              style={[
                styles.network,
                {
                  backgroundColor: isNetworkHovered
                    ? theme.secondaryBackground
                    : theme.primaryBackground
                }
              ]}
            >
              <View style={[flexbox.alignCenter, flexbox.directionRow]}>
                <Pressable
                  onPress={async () => {
                    await openBlockExplorer(networkId, networkData?.explorerUrl)
                  }}
                  style={[
                    spacings.mrTy,
                    spacings.mlMi,
                    {
                      opacity: isNetworkHovered ? 1 : 0
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
                <NetworkIcon width={32} height={32} name={networkId} />
                <Text style={spacings.mlMi} fontSize={16}>
                  {networkName}
                </Text>
              </View>
              <View style={[flexbox.alignCenter, flexbox.directionRow]}>
                <Text fontSize={16} weight="semiBold">
                  {`$${formatThousands(Number(networkBalance?.usd || 0).toFixed(2))}` || '$-'}
                </Text>
                <Pressable
                  onHoverIn={() => setHoveredNetworkId(networkId)}
                  onPress={() => openSettingsBottomSheet(networkId)}
                >
                  {({ hovered }: any) => (
                    <KebabMenuIcon
                      style={spacings.ml}
                      width={16}
                      height={16}
                      color={hovered ? theme.primaryText : theme.secondaryText}
                    />
                  )}
                </Pressable>
              </View>
            </Pressable>
          )
        })}
    </View>
  )
}

export default Networks
