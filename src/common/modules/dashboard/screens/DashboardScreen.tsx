import { TokenResult as TokenResultInterface } from 'ambire-common/src/libs/portfolio/interfaces'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import Banners from '@common/components/Banners'
import Search from '@common/components/Search'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useRoute from '@common/hooks/useRoute'
import colors from '@common/styles/colors'
import spacings, { IS_SCREEN_SIZE_TAB_CONTENT_UP } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Assets from '../components/Assets'
import Routes from '../components/Routes'
import Tabs from '../components/Tabs'
import styles from './styles'

const DashboardScreen = () => {
  const route = useRoute()

  const [openTab, setOpenTab] = useState(() => {
    const params = new URLSearchParams(route?.search)

    return (params.get('tab') as 'tokens' | 'collectibles') || 'tokens'
  })

  const {
    accountPortfolio,
    gasTankAndRewardsData: { rewards, gasTank }
  } = usePortfolioControllerState()
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
    ...(rewards &&
    rewards?.walletClaimableBalance &&
    rewards?.walletClaimableBalance?.amount &&
    Number(rewards?.walletClaimableBalance?.amount)
      ? [
          {
            ...rewards?.walletClaimableBalance,
            vesting: true
          }
        ]
      : []),
    ...(rewards &&
    rewards?.xWalletClaimableBalance &&
    rewards?.xWalletClaimableBalance?.amount &&
    Number(rewards?.xWalletClaimableBalance?.amount)
      ? [
          {
            ...rewards?.xWalletClaimableBalance,
            rewards: true
          }
        ]
      : []),
    ...(gasTank?.balance
      ? gasTank.balance.map((token: TokenResultInterface) => ({
          ...token,
          gasToken: true
        }))
      : []),
    ...(accountPortfolio?.tokens ? accountPortfolio.tokens : [])
  ]

  return (
    <View style={styles.container}>
      <View style={spacings.ph}>
        <View style={[styles.contentContainer]}>
          <View style={styles.overview}>
            <View>
              <Text color={colors.martinique_65} shouldScale={false} weight="regular" fontSize={16}>
                {t('Balance')}
              </Text>
              <View style={[flexbox.directionRow, flexbox.alignEnd]}>
                {accountPortfolio.isAllReady ? (
                  <>
                    <Text
                      fontSize={30}
                      shouldScale={false}
                      style={{ lineHeight: 34 }}
                      weight="regular"
                    >
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

          <View style={styles.banners}>
            <Banners />
          </View>
        </View>
        <View
          style={[
            styles.contentContainer,
            IS_SCREEN_SIZE_TAB_CONTENT_UP ? spacings.plMd : {},
            flexbox.directionRow,
            flexbox.justifySpaceBetween
          ]}
        >
          <Tabs setOpenTab={setOpenTab} openTab={openTab} />
          <Search />
        </View>
      </View>
      <View style={[styles.contentContainer, flexbox.flex1]}>
        <Assets openTab={openTab} tokens={tokens} />
      </View>
    </View>
  )
}

export default DashboardScreen
