import React, { FC, useMemo } from 'react'
import { Animated, View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import FilterIcon from '@common/assets/svg/FilterIcon'
import RefreshIcon from '@common/assets/svg/RefreshIcon'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import DashboardHeader from '@common/modules/dashboard/components/DashboardHeader'
import Gradients from '@common/modules/dashboard/components/Gradients/Gradients'
import Routes from '@common/modules/dashboard/components/Routes'
import { OVERVIEW_CONTENT_MAX_HEIGHT } from '@common/modules/dashboard/screens/DashboardScreen'
import { DASHBOARD_OVERVIEW_BACKGROUND } from '@common/modules/dashboard/screens/styles'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings, { SPACING, SPACING_TY, SPACING_XL } from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import getStyles from './styles'

interface Props {
  openReceiveModal: () => void
  animatedOverviewHeight: Animated.Value
  dashboardOverviewSize: {
    width: number
    height: number
  }
  setDashboardOverviewSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>
}

const DashboardOverview: FC<Props> = ({
  openReceiveModal,
  animatedOverviewHeight,
  dashboardOverviewSize,
  setDashboardOverviewSize
}) => {
  const route = useRoute()
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { navigate } = useNavigation()
  const { networks } = useSettingsControllerState()
  const { selectedAccount } = useMainControllerState()
  const { accountPortfolio, state, refreshPortfolio } = usePortfolioControllerState()

  const [bindNetworkButtonAnim, networkButtonAnimStyle] = useHover({
    preset: 'opacity'
  })
  const [bindRefreshButtonAnim, refreshButtonAnimStyle] = useHover({
    preset: 'opacity'
  })

  const filterByNetworkId = route?.state?.filterByNetworkId || null

  const filterByNetworkName = useMemo(() => {
    if (!filterByNetworkId) return ''

    if (filterByNetworkId === 'rewards') return 'Ambire Rewards'
    if (filterByNetworkId === 'gasTank') return 'Gas Tank'

    const network = networks.find((n) => n.id === filterByNetworkId)

    return network?.name
  }, [filterByNetworkId, networks])

  const totalPortfolioAmount = useMemo(() => {
    if (!filterByNetworkId) return accountPortfolio?.totalAmount || 0

    if (!selectedAccount) return 0

    const selectedAccountPortfolio =
      state?.latest?.[selectedAccount]?.[filterByNetworkId]?.result?.total

    return Number(selectedAccountPortfolio?.usd) || 0
  }, [accountPortfolio?.totalAmount, filterByNetworkId, selectedAccount, state.latest])

  return (
    <View style={[spacings.phSm, spacings.ptSm, spacings.mbMi]}>
      <View style={[styles.contentContainer]}>
        <Animated.View
          style={[
            common.borderRadiusPrimary,
            spacings.ptTy,
            spacings.phSm,
            {
              paddingBottom: animatedOverviewHeight.interpolate({
                inputRange: [0, OVERVIEW_CONTENT_MAX_HEIGHT],
                outputRange: [SPACING_TY, SPACING],
                extrapolate: 'clamp'
              }),
              backgroundColor: DASHBOARD_OVERVIEW_BACKGROUND,
              overflow: 'hidden'
            }
          ]}
          onLayout={(e) => {
            setDashboardOverviewSize({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height
            })
          }}
        >
          <Gradients
            width={dashboardOverviewSize.width}
            height={dashboardOverviewSize.height}
            selectedAccount={selectedAccount}
          />
          <View style={{ zIndex: 2 }}>
            <DashboardHeader />
            <Animated.View
              style={{
                ...styles.overview,
                paddingTop: animatedOverviewHeight.interpolate({
                  inputRange: [0, SPACING_XL],
                  outputRange: [0, SPACING],
                  extrapolate: 'clamp'
                }),
                maxHeight: animatedOverviewHeight,
                overflow: 'hidden'
              }}
            >
              <View>
                <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                  {!accountPortfolio?.isAllReady && totalPortfolioAmount === 0 ? (
                    <SkeletonLoader width={200} height={42} borderRadius={8} />
                  ) : (
                    <>
                      <Text style={spacings.mbTy} selectable testID="full-balance">
                        <Text
                          fontSize={32}
                          shouldScale={false}
                          style={{ lineHeight: 34 }}
                          weight="number_bold"
                          color={theme.primaryBackground}
                          selectable
                        >
                          {t('$')}
                          {formatDecimals(totalPortfolioAmount).split('.')[0]}
                        </Text>
                        <Text
                          fontSize={20}
                          shouldScale={false}
                          weight="number_bold"
                          color={theme.primaryBackground}
                          selectable
                        >
                          {t('.')}
                          {formatDecimals(totalPortfolioAmount).split('.')[1]}
                        </Text>
                      </Text>
                      <View style={spacings.mlTy}>
                        {!accountPortfolio?.isAllReady ? (
                          <Spinner style={{ width: 16, height: 16 }} />
                        ) : (
                          <AnimatedPressable
                            style={refreshButtonAnimStyle}
                            onPress={refreshPortfolio}
                            {...bindRefreshButtonAnim}
                          >
                            <RefreshIcon color={theme.primaryBackground} width={16} height={16} />
                          </AnimatedPressable>
                        )}
                      </View>
                    </>
                  )}
                </View>

                <AnimatedPressable
                  style={[flexbox.directionRow, flexbox.alignCenter, networkButtonAnimStyle]}
                  onPress={() => {
                    navigate(WEB_ROUTES.networks, {
                      state: {
                        filterByNetworkId
                      }
                    })
                  }}
                  {...bindNetworkButtonAnim}
                >
                  {filterByNetworkId ? (
                    <FilterIcon
                      color={theme.primaryBackground}
                      width={16}
                      height={16}
                      style={spacings.mrMi}
                    />
                  ) : null}
                  <Text fontSize={14} color={theme.primaryBackground} weight="medium">
                    {filterByNetworkId ? `${filterByNetworkName} Portfolio` : t('All Networks')}
                  </Text>
                  <DownArrowIcon
                    style={spacings.mlSm}
                    color={theme.primaryBackground}
                    width={12}
                    height={6.5}
                  />
                </AnimatedPressable>
              </View>
              <Routes openReceiveModal={openReceiveModal} />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </View>
  )
}

export default React.memo(DashboardOverview)
