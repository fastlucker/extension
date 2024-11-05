import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Animated, View } from 'react-native'

import WarningIcon from '@common/assets/svg/WarningIcon'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import { useTranslation } from '@common/config/localization'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import DashboardHeader from '@common/modules/dashboard/components/DashboardHeader'
import Gradients from '@common/modules/dashboard/components/Gradients/Gradients'
import Routes from '@common/modules/dashboard/components/Routes'
import { OVERVIEW_CONTENT_MAX_HEIGHT } from '@common/modules/dashboard/screens/DashboardScreen'
import { DASHBOARD_OVERVIEW_BACKGROUND } from '@common/modules/dashboard/screens/styles'
import spacings, { SPACING, SPACING_TY, SPACING_XL } from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import RefreshIcon from './RefreshIcon'
import getStyles from './styles'

interface Props {
  openReceiveModal: () => void
  openGasTankModal: () => void
  animatedOverviewHeight: Animated.Value
  dashboardOverviewSize: {
    width: number
    height: number
  }
  setDashboardOverviewSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>
}

// We create a reusable height constant for both the Balance line-height and the Balance skeleton.
// We want both components to have the same height; otherwise, clicking on the RefreshIcon causes a layout shift.
const BALANCE_HEIGHT = 34

const DashboardOverview: FC<Props> = ({
  openReceiveModal,
  openGasTankModal,
  animatedOverviewHeight,
  dashboardOverviewSize,
  setDashboardOverviewSize
}) => {
  const route = useRoute()
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { networks } = useNetworksControllerState()
  const { selectedAccount } = useAccountsControllerState()
  const { accountPortfolio, startedLoadingAtTimestamp, state, resetAccountPortfolioLocalState } =
    usePortfolioControllerState()
  const [bindRefreshButtonAnim, refreshButtonAnimStyle] = useHover({
    preset: 'opacity'
  })
  const [isLoadingTakingTooLong, setIsLoadingTakingTooLong] = useState(false)

  const filterByNetworkId = route?.state?.filterByNetworkId || null

  const totalPortfolioAmount = useMemo(() => {
    if (!filterByNetworkId) return accountPortfolio?.totalAmount || 0

    if (!selectedAccount) return 0

    const selectedAccountPortfolio =
      state?.latest?.[selectedAccount]?.[filterByNetworkId]?.result?.total

    return Number(selectedAccountPortfolio?.usd) || 0
  }, [accountPortfolio?.totalAmount, filterByNetworkId, selectedAccount, state.latest])

  const [totalPortfolioAmountInteger, totalPortfolioAmountDecimal] = formatDecimals(
    totalPortfolioAmount,
    'price'
  ).split('.')

  const networksWithCriticalErrors: string[] = useMemo(() => {
    if (
      !selectedAccount ||
      !state.latest[selectedAccount] ||
      state.latest[selectedAccount]?.isLoading
    )
      return []

    const networkNames: string[] = []

    Object.keys(state.latest[selectedAccount]).forEach((networkId) => {
      const networkState = state.latest[selectedAccount][networkId]

      if (networkState?.criticalError) {
        let networkName

        if (networkId === 'gasTank') networkName = 'Gas Tank'
        else if (networkId === 'rewards') networkName = 'Rewards'
        else networkName = networks.find((n) => n.id === networkId)?.name

        if (!networkName) return

        networkNames.push(networkName)
      }
    })

    return networkNames
  }, [selectedAccount, state.latest, networks])

  const warningMessage = useMemo(() => {
    if (isLoadingTakingTooLong) {
      return t('Loading all networks is taking too long.')
    }

    if (networksWithCriticalErrors.length) {
      return t('Total balance may be inaccurate due to network issues on {{networks}}', {
        networks: networksWithCriticalErrors.join(', ')
      })
    }

    return undefined
  }, [isLoadingTakingTooLong, networksWithCriticalErrors])

  // Compare the current timestamp with the timestamp when the loading started
  // and if it takes more than 5 seconds, set isLoadingTakingTooLong to true
  useEffect(() => {
    if (!startedLoadingAtTimestamp) {
      setIsLoadingTakingTooLong(false)
      return
    }

    const checkIsLoadingTakingTooLong = () => {
      const takesMoreThan5Seconds = Date.now() - startedLoadingAtTimestamp > 5000

      setIsLoadingTakingTooLong(takesMoreThan5Seconds)
    }

    checkIsLoadingTakingTooLong()

    const interval = setInterval(() => {
      if (accountPortfolio?.isAllReady) {
        clearInterval(interval)
        setIsLoadingTakingTooLong(false)
        return
      }

      checkIsLoadingTakingTooLong()
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [accountPortfolio?.isAllReady, startedLoadingAtTimestamp])

  const reloadAccount = useCallback(() => {
    resetAccountPortfolioLocalState()
    dispatch({
      type: 'MAIN_CONTROLLER_RELOAD_SELECTED_ACCOUNT'
    })
  }, [dispatch, resetAccountPortfolioLocalState])

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
                <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbTy]}>
                  {!accountPortfolio?.isAllReady ? (
                    <SkeletonLoader
                      lowOpacity
                      width={200}
                      height={BALANCE_HEIGHT}
                      borderRadius={8}
                    />
                  ) : (
                    <View testID="full-balance" style={[flexbox.directionRow, flexbox.alignCenter]}>
                      <Text selectable>
                        <Text
                          fontSize={32}
                          shouldScale={false}
                          style={{ lineHeight: BALANCE_HEIGHT }}
                          weight="number_bold"
                          color={theme.primaryBackground}
                          selectable
                        >
                          {totalPortfolioAmountInteger}
                        </Text>
                        <Text
                          fontSize={20}
                          shouldScale={false}
                          weight="number_bold"
                          color={theme.primaryBackground}
                          selectable
                        >
                          {t('.')}
                          {totalPortfolioAmountDecimal}
                        </Text>
                      </Text>
                    </View>
                  )}
                  <AnimatedPressable
                    style={[spacings.mlTy, refreshButtonAnimStyle]}
                    onPress={reloadAccount}
                    {...bindRefreshButtonAnim}
                    disabled={!accountPortfolio?.isAllReady}
                    testID="refresh-button"
                  >
                    <RefreshIcon
                      spin={!accountPortfolio?.isAllReady}
                      color={theme.primaryBackground}
                      width={16}
                      height={16}
                    />
                  </AnimatedPressable>
                </View>

                <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                  <AnimatedPressable onPress={() => openGasTankModal()}>
                    <Text>Gat tank</Text>
                  </AnimatedPressable>
                  {!!warningMessage && (
                    <>
                      <WarningIcon
                        color={theme.warningDecorative}
                        style={spacings.mlTy}
                        data-tooltip-id="portfolio-warning"
                        data-tooltip-content={warningMessage}
                        width={21}
                        height={21}
                      />
                      <Tooltip id="portfolio-warning" />
                    </>
                  )}
                </View>
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
