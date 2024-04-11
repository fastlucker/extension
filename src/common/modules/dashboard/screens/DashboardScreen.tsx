import React, { useMemo, useRef, useState } from 'react'
import { Animated, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import FilterIcon from '@common/assets/svg/FilterIcon'
import RefreshIcon from '@common/assets/svg/RefreshIcon'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings, { SPACING, SPACING_TY, SPACING_XL } from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import ReceiveModal from '@web/components/ReceiveModal'
import useHover, { AnimatedPressable, DURATIONS } from '@web/hooks/useHover'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { getUiType } from '@web/utils/uiType'

import DAppFooter from '../components/DAppFooter'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSectionList from '../components/DashboardSectionList'
import Gradients from '../components/Gradients/Gradients'
import Routes from '../components/Routes'
import getStyles, { DASHBOARD_OVERVIEW_BACKGROUND } from './styles'

const { isPopup, isTab } = getUiType()

const DEFAULT_MAX_HEIGHT = 120

const DashboardScreen = () => {
  const route = useRoute()
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { navigate } = useNavigation()
  const { minWidthSize } = useWindowSize()
  const { networks } = useSettingsControllerState()
  const { selectedAccount } = useMainControllerState()
  const { accountPortfolio, state, refreshPortfolio } = usePortfolioControllerState()
  const { ref: receiveModalRef, open: openReceiveModal, close: closeReceiveModal } = useModalize()
  const [bindNetworkButtonAnim, networkButtonAnimStyle] = useHover({
    preset: 'opacity'
  })
  const [bindRefreshButtonAnim, refreshButtonAnimStyle] = useHover({
    preset: 'opacity'
  })
  const [dashboardOverviewSize, setDashboardOverviewSize] = useState({
    width: 0,
    height: 0
  })
  const maxHeight = useRef(new Animated.Value(DEFAULT_MAX_HEIGHT)).current
  const paddingTop = useRef(new Animated.Value(SPACING_XL)).current
  const paddingBottom = useRef(new Animated.Value(SPACING)).current

  const filterByNetworkId = route?.state?.filterByNetworkId || null

  const onScroll = (value: number) => {
    if (!isPopup) return

    const isOverviewShown = value < 60

    Animated.parallel([
      Animated.timing(maxHeight, {
        toValue: isOverviewShown ? DEFAULT_MAX_HEIGHT : 0,
        duration: DURATIONS.REGULAR,
        useNativeDriver: !isWeb
      }),
      Animated.timing(paddingTop, {
        toValue: isOverviewShown ? SPACING_XL : 0,
        duration: DURATIONS.REGULAR,
        useNativeDriver: !isWeb
      }),
      Animated.timing(paddingBottom, {
        toValue: isOverviewShown ? SPACING : SPACING_TY,
        duration: DURATIONS.REGULAR,
        useNativeDriver: !isWeb
      })
    ]).start()
  }

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
    <>
      <ReceiveModal modalRef={receiveModalRef} handleClose={closeReceiveModal} />
      <View style={styles.container}>
        <View style={[spacings.phSm, spacings.ptSm, spacings.mbMi]}>
          <View style={[styles.contentContainer]}>
            <Animated.View
              style={[
                common.borderRadiusPrimary,
                spacings.ptTy,
                spacings.phSm,
                {
                  paddingBottom,
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
                    paddingTop,
                    maxHeight,
                    overflow: 'hidden'
                  }}
                >
                  <View>
                    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                      {!accountPortfolio?.isAllReady && totalPortfolioAmount === 0 ? (
                        <SkeletonLoader width={200} height={42} borderRadius={8} />
                      ) : (
                        <>
                          <Text style={spacings.mbTy} selectable>
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
                                <RefreshIcon
                                  color={theme.primaryBackground}
                                  width={16}
                                  height={16}
                                />
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
        <View style={[flexbox.flex1, isTab && minWidthSize('l') && spacings.phSm]}>
          <DashboardSectionList
            accountPortfolio={accountPortfolio}
            tokenPreferences={state?.tokenPreferences}
            filterByNetworkId={filterByNetworkId}
            onScroll={onScroll}
          />
        </View>
        {!!isPopup && <DAppFooter />}
      </View>
    </>
  )
}

export default React.memo(DashboardScreen)
