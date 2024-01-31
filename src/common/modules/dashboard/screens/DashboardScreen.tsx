import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import FilterIcon from '@common/assets/svg/FilterIcon'
import RefreshIcon from '@common/assets/svg/RefreshIcon'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import ReceiveModal from '@web/components/ReceiveModal'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { getUiType } from '@web/utils/uiType'

import DAppFooter from '../components/DAppFooter'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSectionList from '../components/DashboardSectionList'
import Gradients from '../components/Gradients/Gradients'
import Routes from '../components/Routes'
import { useShowDashboard } from '../hooks/useShowDashboard'
import getStyles, { DASHBOARD_OVERVIEW_BACKGROUND } from './styles'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const { isPopup } = getUiType()

const DashboardScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { navigate } = useNavigation()
  const rotation = useSharedValue(0)
  const [isReceiveModalVisible, setIsReceiveModalVisible] = useState(false)
  const [fakeIsLoading, setFakeIsLoading] = useState(false)
  const [dashboardOverviewSize, setDashboardOverviewSize] = useState({
    width: 0,
    height: 0
  })

  const route = useRoute()
  const filterByNetworkId = route?.state?.filterByNetworkId || null

  const { networks } = useSettingsControllerState()
  const { selectedAccount } = useMainControllerState()
  const { showView } = useShowDashboard()
  const { accountPortfolio, state } = usePortfolioControllerState()

  const { t } = useTranslation()

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

    const selectedAccountPortfolio = state.latest[selectedAccount][filterByNetworkId]?.result?.total

    return Number(selectedAccountPortfolio?.usd) || 0
  }, [accountPortfolio?.totalAmount, filterByNetworkId, selectedAccount, state.latest])

  const refreshPortfolio = useCallback(() => {
    rotation.value = withRepeat(
      withTiming(rotation.value + 360, {
        duration: 1000,
        easing: Easing.linear
      }),
      -1
    )
    setFakeIsLoading(true)
    dispatch({
      type: 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT',
      params: {
        forceUpdate: true
      }
    })
  }, [dispatch])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }]
    }
  })

  // Fake loading
  useEffect(() => {
    setFakeIsLoading(false)
    rotation.value = 0
  }, [accountPortfolio])

  return (
    <>
      <ReceiveModal isOpen={isReceiveModalVisible} setIsOpen={setIsReceiveModalVisible} />
      <View style={styles.container}>
        <View style={[spacings.phSm, spacings.ptSm, spacings.mbMi]}>
          <View style={[styles.contentContainer]}>
            <View
              style={[
                common.borderRadiusPrimary,
                spacings.pvTy,
                spacings.phSm,
                spacings.pb,
                {
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
                <View style={styles.overview}>
                  <View>
                    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                      {!fakeIsLoading ? (
                        <Text style={spacings.mbTy}>
                          <Text
                            fontSize={32}
                            shouldScale={false}
                            style={{ lineHeight: 34 }}
                            weight="number_bold"
                            color={theme.primaryBackground}
                          >
                            {t('$')}
                            {Number(totalPortfolioAmount.toFixed(2).split('.')[0]).toLocaleString(
                              'en-US'
                            )}
                          </Text>
                          <Text
                            fontSize={20}
                            shouldScale={false}
                            weight="number_bold"
                            color={theme.primaryBackground}
                          >
                            {t('.')}
                            {Number(totalPortfolioAmount.toFixed(2).split('.')[1])}
                          </Text>
                        </Text>
                      ) : (
                        <View style={styles.overviewLoader} />
                      )}
                      <AnimatedPressable
                        onPress={refreshPortfolio}
                        style={[animatedStyle, spacings.mlTy]}
                      >
                        <RefreshIcon color={theme.primaryBackground} width={16} height={16} />
                      </AnimatedPressable>
                    </View>
                    <Pressable
                      style={({ hovered }: any) => [
                        flexbox.directionRow,
                        flexbox.alignCenter,
                        { opacity: hovered ? 1 : 0.7 }
                      ]}
                      onPress={() => {
                        navigate(WEB_ROUTES.networks, {
                          state: {
                            filterByNetworkId
                          }
                        })
                      }}
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
                    </Pressable>
                  </View>
                  <Routes setIsReceiveModalVisible={setIsReceiveModalVisible} />
                </View>
              </View>
            </View>
          </View>
        </View>
        <DashboardSectionList
          accountPortfolio={accountPortfolio}
          filterByNetworkId={filterByNetworkId}
        />
        {!!isPopup && <DAppFooter />}
      </View>
    </>
  )
}

export default DashboardScreen
