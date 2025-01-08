import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import NetworksIcon from '@common/assets/svg/NetworksIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useMultiHover } from '@web/hooks/useHover'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import getStyles from '@web/modules/networks/screens/styles'

const AllNetworksOption = () => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { portfolio: selectedAccountPortfolio, dashboardNetworkFilter } =
    useSelectedAccountControllerState()
  const { dispatch } = useBackgroundService()

  const [bindAnim, animStyle] = useMultiHover({
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
    forceHoveredStyle: !dashboardNetworkFilter
  })

  return (
    <AnimatedPressable
      onPress={() => {
        dispatch({
          type: 'SELECTED_ACCOUNT_SET_DASHBOARD_NETWORK_FILTER',
          params: { dashboardNetworkFilter: null }
        })
        navigate(WEB_ROUTES.dashboard)
      }}
      style={[styles.network, styles.noKebabNetwork, animStyle]}
      {...bindAnim}
    >
      <View style={[flexbox.alignCenter, flexbox.directionRow]}>
        <View
          style={{
            width: 32,
            height: 32,
            ...flexbox.center
          }}
        >
          {/* @ts-ignore */}
          <NetworksIcon width={20} height={20} />
        </View>
        <Text style={spacings.mlTy} fontSize={16}>
          {t('All Networks')}
        </Text>
      </View>
      <Text fontSize={!dashboardNetworkFilter ? 20 : 16} weight="semiBold">
        {`$${formatDecimals(Number(selectedAccountPortfolio?.totalBalance || 0))}` || '$-'}
      </Text>
    </AnimatedPressable>
  )
}

export default React.memo(AllNetworksOption)
