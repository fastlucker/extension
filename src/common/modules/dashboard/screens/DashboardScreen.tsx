import React, { useState } from 'react'
import { View } from 'react-native'

import Banners from '@common/components/Banners'
import Search from '@common/components/Search'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import { BANNER_TOPICS } from '@common/contexts/bannerContext/bannerContext'
import useRoute from '@common/hooks/useRoute'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { getUiType } from '@web/utils/uiType'

import Assets from '../components/Assets'
import Routes from '../components/Routes'
import Tabs from '../components/Tabs'
import styles from './styles'

const isTab = getUiType().isTab

const DashboardScreen = () => {
  const route = useRoute()

  const [openTab, setOpenTab] = useState(() => {
    const params = new URLSearchParams(route?.search)

    return (params.get('tab') as 'tokens' | 'collectibles') || 'tokens'
  })

  const {
    accountPortfolio,
    startedLoading
  } = usePortfolioControllerState()

  const { t } = useTranslation()

  const tokens = accountPortfolio?.tokens || []
  const showView = (startedLoading && (Date.now() - startedLoading) > 5000) || accountPortfolio?.isAllReady

if (!showView) return (<View style={[flexbox.alignCenter]}>
      <Spinner />
    </View>)

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
                {(
                  <>
                    <Text
                      fontSize={30}
                      shouldScale={false}
                      style={{ lineHeight: 34 }}
                      weight="regular"
                    >
                     {t('$')}{' '}
                      {Number(accountPortfolio?.totalAmount.toFixed(2).split('.')[0]).toLocaleString(
                        'en-US'
                      )}
                    </Text>
                    <Text fontSize={20} shouldScale={false} weight="regular">
                      {t('.')}{Number(accountPortfolio?.totalAmount.toFixed(2).split('.')[1])}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <Routes />
          </View>

          <View style={styles.banners}>
            <Banners
              topics={[
                BANNER_TOPICS.TRANSACTION,
                BANNER_TOPICS.ANNOUNCEMENT,
                BANNER_TOPICS.WARNING
              ]}
            />
          </View>
        </View>
        <View
          style={[
            styles.contentContainer,
            isTab ? spacings.ph : {},
            flexbox.flex1,
            flexbox.directionRow,
            flexbox.justifySpaceBetween
          ]}
        >
          <Tabs setOpenTab={setOpenTab} openTab={openTab} />
          <Search />
        </View>
      </View>
      <View style={[styles.contentContainer, { flex: 1 }]}>
        <Assets openTab={openTab} tokens={tokens} />
      </View>
    </View>
  )
}

export default DashboardScreen
