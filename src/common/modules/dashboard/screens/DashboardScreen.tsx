import React, { useEffect } from 'react'
import { View } from 'react-native'

import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import { AssetsToggleProvider } from '@common/modules/dashboard/contexts/assetsToggleContext'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Assets from '../components/Assets'
import Routes from '../components/Routes'
import styles from './styles'

const DashboardScreen = () => {
  const { accountPortfolio, gasTankAndRewardsState } = usePortfolioControllerState()

  const { dispatch } = useBackgroundService()

  useEffect(() => {
    const fetchData = () => {
      dispatch({ type: 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT' })
    }

    // Fetch data on page load
    fetchData()

    // Set up interval to refetch data every minute
    const interval = setInterval(fetchData, 60000) // 60000 milliseconds = 1 minute

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [dispatch])

  const { t } = useTranslation()
  const tokens = [
    ...(gasTankAndRewardsState?.gasTank?.balance
      ? gasTankAndRewardsState.gasTank.balance.map((t) => ({ ...t, gasToken: true }))
      : []),
    ...(accountPortfolio?.tokens ? accountPortfolio.tokens : [])
  ]
  return (
    <Wrapper contentContainerStyle={[spacings.pv0, spacings.ph0]} style={styles.container}>
      <View
        style={[flexbox.directionRow, flexbox.justifySpaceBetween, spacings.phSm, spacings.pvSm]}
      >
        <View>
          <Text color={colors.martinique_65} shouldScale={false} weight="regular" fontSize={16}>
            {t('Balance')}
          </Text>
          <View style={[flexbox.directionRow, flexbox.alignEnd]}>
            {accountPortfolio.isAllReady ? (
              <>
                <Text fontSize={30} shouldScale={false} style={{ lineHeight: 34 }} weight="regular">
                  ${' '}
                  {Number(accountPortfolio.totalAmount.toFixed(2).split('.')[0]).toLocaleString(
                    'en-US'
                  )}
                </Text>
                <Text fontSize={20} shouldScale={false} weight="regular">
                  .{Number(accountPortfolio.totalAmount.toFixed(2).split('.')[1])}
                </Text>
              </>
            ) : (
              <Spinner style={{ width: 25, height: 25 }} />
            )}
          </View>
        </View>
        <Routes />
      </View>
      <View style={[flexbox.flex1]}>
        <AssetsToggleProvider>
          <Assets tokens={tokens} />
        </AssetsToggleProvider>
      </View>
    </Wrapper>
  )
}

export default DashboardScreen
