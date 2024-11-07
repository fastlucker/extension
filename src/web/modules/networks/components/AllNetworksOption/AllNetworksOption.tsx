import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import NetworksIcon from '@common/assets/svg/NetworksIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import { AnimatedPressable, useMultiHover } from '@web/hooks/useHover'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import getStyles from '@web/modules/networks/screens/styles'

interface Props {
  filterByNetworkId: string | null
}

const AllNetworksOption: FC<Props> = ({ filterByNetworkId }) => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const { state } = useRoute()
  const { theme, styles } = useTheme(getStyles)
  const portfolioControllerState = usePortfolioControllerState()
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
    forceHoveredStyle: !filterByNetworkId
  })

  return (
    <AnimatedPressable
      onPress={() => {
        navigate(`${WEB_ROUTES.dashboard}${state.prevTab ? `?${state.prevTab}` : ''}`, {
          state: {
            filterByNetworkId: null
          }
        })
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
      <Text fontSize={!filterByNetworkId ? 20 : 16} weight="semiBold">
        {`$${formatDecimals(
          Number(portfolioControllerState.accountPortfolio?.totalAmount || 0)
        )}` || '$-'}
      </Text>
    </AnimatedPressable>
  )
}

export default AllNetworksOption
