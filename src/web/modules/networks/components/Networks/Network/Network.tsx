import { t } from 'i18next'
import React, { FC, useCallback } from 'react'
import { Pressable, View } from 'react-native'

import { NetworkId } from '@ambire-common/interfaces/network'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useNavigation from '@common/hooks/useNavigation/useNavigation.web'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, DURATIONS, useCustomHover, useMultiHover } from '@web/hooks/useHover'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import getStyles from '@web/modules/networks/screens/styles'

interface Props {
  networkId: NetworkId
  openBlockExplorer: (url?: string) => void
  openSettingsBottomSheet: (networkId: NetworkId) => void
}

const Network: FC<Props> = ({ networkId, openBlockExplorer, openSettingsBottomSheet }) => {
  const { navigate } = useNavigation()
  const { theme, styles } = useTheme(getStyles)
  const { networks } = useNetworksControllerState()
  const { portfolio, dashboardNetworkFilter } = useSelectedAccountControllerState()
  const { dispatch } = useBackgroundService()
  const [bindAnim, animStyle, isHovered, triggerHover] = useMultiHover({
    values: [
      {
        property: 'backgroundColor',
        from: `${String(theme.secondaryBackground)}00`,
        to: theme.secondaryBackground
      },
      {
        property: 'borderColor',
        from: `${String(theme.secondaryBorder)}00`,
        to: theme.secondaryBorder
      }
    ],
    forceHoveredStyle: dashboardNetworkFilter === networkId
  })
  const isInternalNetwork = networkId === 'rewards' || networkId === 'gasTank'
  // Doesn't have to be binded
  const [, explorerIconAnimStyle] = useCustomHover({
    property: 'opacity',
    values: {
      from: 0,
      to: 1
    },
    forceHoveredStyle: (isHovered || dashboardNetworkFilter === networkId) && !isInternalNetwork,
    duration: DURATIONS.REGULAR
  })

  const navigateAndFilterDashboard = () => {
    dispatch({
      type: 'SELECTED_ACCOUNT_SET_DASHBOARD_NETWORK_FILTER',
      params: { dashboardNetworkFilter: networkId }
    })
    navigate(WEB_ROUTES.dashboard)
  }

  const networkData = networks.find((network) => network.id === networkId)
  const isBlockExplorerMissing = !networkData?.explorerUrl
  const tooltipBlockExplorerMissingId = `tooltip-for-block-explorer-missing-${networkId}`
  const handleOpenBlockExplorer = useCallback(async () => {
    if (isBlockExplorerMissing) return

    await openBlockExplorer(networkData?.explorerUrl)
  }, [networkData, openBlockExplorer, isBlockExplorerMissing])

  const networkBalance = portfolio.latest?.[networkId]?.result?.total
  let networkName = networkData?.name

  if (networkId === 'rewards') {
    networkName = 'Ambire Rewards'
  } else if (networkId === 'gasTank') {
    networkName = 'Gas Tank'
  }

  return (
    <AnimatedPressable
      key={networkId}
      onPress={navigateAndFilterDashboard}
      style={[styles.network, isInternalNetwork ? styles.noKebabNetwork : {}, animStyle]}
      {...bindAnim}
    >
      <View style={[flexbox.alignCenter, flexbox.directionRow]}>
        <NetworkIcon size={32} id={networkId} />
        <Text style={spacings.mlTy} fontSize={16}>
          {networkName}
        </Text>
        <AnimatedPressable
          onPress={handleOpenBlockExplorer}
          // @ts-ignore missing type, but the prop is valid
          dataSet={{
            tooltipId: tooltipBlockExplorerMissingId,
            tooltipContent: t('No block explorer available for this network')
          }}
          style={[spacings.mlSm, explorerIconAnimStyle]}
          onHoverIn={triggerHover}
        >
          {({ hovered }: any) => (
            <OpenIcon
              width={16}
              height={16}
              color={hovered ? theme.primaryText : theme.secondaryText}
              style={isBlockExplorerMissing && { opacity: 0.4 }}
            />
          )}
        </AnimatedPressable>
        {isBlockExplorerMissing && <Tooltip id={tooltipBlockExplorerMissingId} />}
      </View>
      <View style={[flexbox.alignCenter, flexbox.directionRow]}>
        <Text fontSize={dashboardNetworkFilter === networkId ? 20 : 16} weight="semiBold">
          {`$${formatDecimals(Number(networkBalance?.usd || 0))}` || '$-'}
        </Text>
        {!isInternalNetwork && (
          <Pressable
            onHoverIn={triggerHover}
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
    </AnimatedPressable>
  )
}

export default React.memo(Network)
