import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

import Banners from '@common/components/Banners'
import NetworkIcon from '@common/components/NetworkIcon'
import Search from '@common/components/Search'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { getUiType } from '@web/utils/uiType'

import Assets from '../components/Assets'
import DAppFooter from '../components/DAppFooter'
import Routes from '../components/Routes'
import Tabs from '../components/Tabs'
import getStyles from './styles'

// We want to change the query param without refreshing the page.
const handleChangeQuery = (openTab: string) => {
  if (window.location.href.includes('?tab=')) {
    window.history.pushState(null, '', `${window.location.href.split('?')[0]}?tab=${openTab}`)
    return
  }

  window.history.pushState(null, '', `${window.location.href}?tab=${openTab}`)
}

const { isPopup } = getUiType()

const DashboardScreen = () => {
  const { styles } = useTheme(getStyles)
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

  const networksWithAssets = useMemo(() => {
    const nonZeroBalanceTokens = tokens?.filter((token) => token.amount !== 0n)

    return [...new Set(nonZeroBalanceTokens?.map((token) => token.networkId) || [])]
  }, [tokens])

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
    <View style={styles.container}>
      <View style={spacings.phLg}>
        <View style={[styles.contentContainer]}>
          <View style={styles.overview}>
            <View>
              <View style={[flexbox.directionRow, flexbox.alignEnd]}>
                <Text style={{ marginBottom: 8 }}>
                  <Text
                    fontSize={32}
                    shouldScale={false}
                    style={{ lineHeight: 34 }}
                    weight="number_bold"
                  >
                    {t('$')}
                    {Number(accountPortfolio?.totalAmount.toFixed(2).split('.')[0]).toLocaleString(
                      'en-US'
                    )}
                  </Text>
                  <Text fontSize={20} shouldScale={false} weight="semiBold">
                    {t('.')}
                    {Number(accountPortfolio?.totalAmount.toFixed(2).split('.')[1])}
                  </Text>
                </Text>
              </View>
              <View style={styles.networks}>
                {networksWithAssets.map((networkId, index) => (
                  <View
                    key={networkId}
                    style={[
                      styles.networkIconContainer,
                      { zIndex: networksWithAssets.length - index }
                    ]}
                  >
                    <NetworkIcon style={styles.networkIcon} name={networkId} />
                  </View>
                ))}
              </View>
            </View>
            <Routes />
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
          <Search control={control} height={32} placeholder="Search for tokens" />
        </View>
      </View>
      <View style={[styles.contentContainer, flexbox.flex1]}>
        {tokens && <Assets searchValue={searchValue} openTab={openTab} tokens={tokens} />}
      </View>
      {isPopup && <DAppFooter />}
    </View>
  )
}

export default DashboardScreen
