import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

import Banners from '@common/components/Banners'
import Search from '@common/components/Search'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useRoute from '@common/hooks/useRoute'
import Header from '@common/modules/header/components/Header'
import colors from '@common/styles/colors'
import spacings, { IS_SCREEN_SIZE_TAB_CONTENT_UP } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Assets from '../components/Assets'
import Routes from '../components/Routes'
import Tabs from '../components/Tabs'
import styles from './styles'

// We want to change the query param without refreshing the page.
const handleChangeQuery = (openTab: string) => {
  if (window.location.href.includes('?tab=')) {
    window.history.pushState(null, '', `${window.location.href.split('?')[0]}?tab=${openTab}`)
    return
  }

  window.history.pushState(null, '', `${window.location.href}?tab=${openTab}`)
}

const DashboardScreen = () => {
  const route = useRoute()
  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const searchValue = watch('search')

  const [openTab, setOpenTab] = useState(() => {
    const params = new URLSearchParams(route?.search)

    return (params.get('tab') as 'tokens' | 'collectibles') || 'tokens'
  })

  const { accountPortfolio, startedLoading } = usePortfolioControllerState()

  const { t } = useTranslation()

  // const tokens = accountPortfolio?.tokens || []
  const tokens = useMemo(
    () =>
      accountPortfolio?.tokens.filter((token) => {
        if (!searchValue) return true

        const doesAddressMatch = token.address.toLowerCase().includes(searchValue.toLowerCase())
        const doesSymbolMatch = token.symbol.toLowerCase().includes(searchValue.toLowerCase())

        return doesAddressMatch || doesSymbolMatch
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountPortfolio?.tokens?.length, searchValue]
  )

  useEffect(() => {
    if (searchValue.length > 0 && openTab === 'collectibles') {
      handleChangeQuery('tokens')
      setOpenTab('tokens')
    }
  }, [searchValue, openTab])

  const showView =
    (startedLoading ? Date.now() - startedLoading > 5000 : false) || accountPortfolio?.isAllReady

  if (!showView)
    return (
      <View style={[flexbox.alignCenter]}>
        <Spinner />
      </View>
    )

  return (
    <>
      <Header />
      <View style={styles.container}>
        <View style={spacings.ph}>
          <View style={[styles.contentContainer]}>
            <View style={styles.overview}>
              <View>
                <Text appearance="secondaryText" shouldScale={false} weight="regular" fontSize={16}>
                  {t('Balance')}
                </Text>
                <View style={[flexbox.directionRow, flexbox.alignEnd]}>
                  <>
                    <Text
                      fontSize={30}
                      shouldScale={false}
                      style={{ lineHeight: 34 }}
                      weight="regular"
                    >
                      {t('$')}{' '}
                      {Number(
                        accountPortfolio?.totalAmount.toFixed(2).split('.')[0]
                      ).toLocaleString('en-US')}
                    </Text>
                    <Text fontSize={20} shouldScale={false} weight="regular">
                      {t('.')}
                      {Number(accountPortfolio?.totalAmount.toFixed(2).split('.')[1])}
                    </Text>
                  </>
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
              flexbox.justifySpaceBetween,
              flexbox.alignEnd
            ]}
          >
            <Tabs handleChangeQuery={handleChangeQuery} setOpenTab={setOpenTab} openTab={openTab} />
            <Search control={control} placeholder="Search for tokens" />
          </View>
        </View>
        <View style={[styles.contentContainer, flexbox.flex1]}>
          <Assets searchValue={searchValue} openTab={openTab} tokens={tokens} />
        </View>
      </View>
    </>
  )
}

export default DashboardScreen
