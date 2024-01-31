import React, { useCallback, useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import FilterIcon from '@common/assets/svg/FilterIcon'
import RefreshIcon from '@common/assets/svg/RefreshIcon'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
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
import getStyles, { DASHBOARD_OVERVIEW_BACKGROUND } from './styles'

const { isPopup, isTab } = getUiType()

const DashboardScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { navigate } = useNavigation()
  const { minWidthSize } = useWindowSize()
  const [isReceiveModalVisible, setIsReceiveModalVisible] = useState(false)
  const [dashboardOverviewSize, setDashboardOverviewSize] = useState({
    width: 0,
    height: 0
  })

  const route = useRoute()
  const filterByNetworkId = route?.state?.filterByNetworkId || null

  const { networks } = useSettingsControllerState()
  const { selectedAccount } = useMainControllerState()
  const { accountPortfolio, state, setAccountPortfolio } = usePortfolioControllerState()

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
    dispatch({
      type: 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT',
      params: {
        forceUpdate: true
      }
    })
    setAccountPortfolio({ ...accountPortfolio, isAllReady: false } as any)
  }, [dispatch, accountPortfolio, setAccountPortfolio])

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

                      <View style={spacings.mlTy}>
                        {!accountPortfolio?.isAllReady ? (
                          <Spinner style={{ width: 16, height: 16 }} />
                        ) : (
                          <Pressable onPress={refreshPortfolio}>
                            <RefreshIcon color={theme.primaryBackground} width={16} height={16} />
                          </Pressable>
                        )}
                      </View>
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
        <View style={[flexbox.flex1, isTab && minWidthSize('l') && spacings.phSm]}>
          <DashboardSectionList
            accountPortfolio={accountPortfolio}
            filterByNetworkId={filterByNetworkId}
          />
        </View>
        {!!isPopup && <DAppFooter />}
      </View>
    </>
  )
}

export default DashboardScreen
