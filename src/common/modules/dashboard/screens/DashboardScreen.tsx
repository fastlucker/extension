import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
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
import Search from '@common/components/Search'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import Banners from '@common/modules/dashboard/components/DashboardBanners'
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

import Assets from '../components/Assets'
import DAppFooter from '../components/DAppFooter'
import DashboardHeader from '../components/DashboardHeader'
import Gradients from '../components/Gradients/Gradients'
import Routes from '../components/Routes'
import Tabs from '../components/Tabs'
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

  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const searchValue = watch('search')

  const [openTab, setOpenTab] = useState(() => {
    const params = new URLSearchParams(route?.search)

    return (params.get('tab') as 'tokens' | 'collectibles' | 'defi') || 'tokens'
  })
  const { networks } = useSettingsControllerState()
  const { selectedAccount } = useMainControllerState()
  const { accountPortfolio, startedLoading, state } = usePortfolioControllerState()

  const { t } = useTranslation()

  // We want to change the query param without refreshing the page.
  const handleChangeQuery = useCallback((tab: string) => {
    if (window.location.href.includes('?tab=')) {
      window.history.pushState(null, '', `${window.location.href.split('?')[0]}?tab=${tab}`)
      return
    }

    window.history.pushState(null, '', `${window.location.href}?tab=${tab}`)
  }, [])

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

  const tokens = useMemo(
    () =>
      accountPortfolio?.tokens
        .filter((token) => {
          if (!filterByNetworkId) return true
          if (filterByNetworkId === 'rewards') return token.flags.rewardsType
          if (filterByNetworkId === 'gasTank') return token.flags.onGasTank

          return token.networkId === filterByNetworkId
        })
        .filter((token) => {
          if (!searchValue) return true

          const doesAddressMatch = token.address.toLowerCase().includes(searchValue.toLowerCase())
          const doesSymbolMatch = token.symbol.toLowerCase().includes(searchValue.toLowerCase())

          return doesAddressMatch || doesSymbolMatch
        }),
    [accountPortfolio?.tokens, filterByNetworkId, searchValue]
  )

  useEffect(() => {
    if (searchValue.length > 0 && openTab === 'collectibles') {
      handleChangeQuery('tokens')
      setOpenTab('tokens')
    }
  }, [searchValue, openTab])

  const showView =
    (startedLoading ? Date.now() - startedLoading > 5000 : false) || accountPortfolio?.isAllReady

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

  if (!showView)
    return (
      <View style={[flexbox.flex1, flexbox.justifyCenter, flexbox.alignCenter]}>
        <Spinner />
      </View>
    )

  return (
    <>
      <ReceiveModal isOpen={isReceiveModalVisible} setIsOpen={setIsReceiveModalVisible} />
      <View style={styles.container}>
        <View style={[spacings.phSm, spacings.ptSm]}>
          <View style={[styles.contentContainer, spacings.mb]}>
            <View
              style={[
                common.borderRadiusPrimary,
                spacings.pvTy,
                spacings.phSm,
                spacings.pbMd,
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
              <Gradients size={dashboardOverviewSize} />
              <View style={{ zIndex: 2 }}>
                <DashboardHeader />
                <View style={styles.overview}>
                  <View>
                    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                      {!fakeIsLoading ? (
                        <Text style={spacings.mbTy}>
                          <Text
                            testID="full-balance"
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
            <Banners />
          </View>
          <View
            style={[
              styles.contentContainer,
              flexbox.directionRow,
              flexbox.justifySpaceBetween,
              flexbox.alignCenter,
              spacings.mbMd
            ]}
          >
            <Tabs handleChangeQuery={handleChangeQuery} setOpenTab={setOpenTab} openTab={openTab} />
            <Search
              containerStyle={{ flex: 1, maxWidth: 206 }}
              control={control}
              height={32}
              placeholder="Search for tokens"
            />
          </View>
        </View>
        <View style={[styles.contentContainer, flexbox.flex1]}>
          {!!tokens && <Assets searchValue={searchValue} openTab={openTab} tokens={tokens} />}
        </View>
        {!!isPopup && <DAppFooter />}
      </View>
    </>
  )
}

export default DashboardScreen
