import React, { FC, useMemo } from 'react'
import { Animated, View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import FilterIcon from '@common/assets/svg/FilterIcon'
import RefreshIcon from '@common/assets/svg/RefreshIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import DashboardHeader from '@common/modules/dashboard/components/DashboardHeader'
import Gradients from '@common/modules/dashboard/components/Gradients/Gradients'
import Routes from '@common/modules/dashboard/components/Routes'
import useBanners from '@common/modules/dashboard/hooks/useBanners'
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
  const banners = useBanners()
  const { accountPortfolio, startedLoading, state, refreshPortfolio } =
    usePortfolioControllerState()

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

  const isBalanceInaccurate = useMemo(() => {
    const portfolioRelatedBanners = banners.filter(
      (banner) =>
        banner.id === `${selectedAccount}-portfolio-prices-error` ||
        banner.id === `${selectedAccount}-portfolio-critical-error`
    )

    return !!portfolioRelatedBanners.length
  }, [banners, selectedAccount])

  return (
    <View style={[spacings.phSm, spacings.mbMi]}>
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
                  {!accountPortfolio?.isAllReady ? (
                    <SkeletonLoader lowOpacity width={200} height={42} borderRadius={8} />
                  ) : (
                    <View
                      testID="full-balance"
                      style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbTy]}
                    >
                      <Text selectable>
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
                      {isBalanceInaccurate ||
                        (!accountPortfolio?.isAllReady && (
                          <>
                            <WarningIcon
                              color={theme.warningDecorative}
                              style={spacings.mlMi}
                              data-tooltip-id="total-balance-warning"
                              data-tooltip-content={t(
                                'Total balance may be inaccurate due to missing data.'
                              )}
                            />
                            <Tooltip id="total-balance-warning" />
                          </>
                        ))}
                      <AnimatedPressable
                        style={[spacings.mlTy, refreshButtonAnimStyle]}
                        onPress={refreshPortfolio}
                        {...bindRefreshButtonAnim}
                      >
                        <RefreshIcon color={theme.primaryBackground} width={16} height={16} />
                      </AnimatedPressable>
                    </View>
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
