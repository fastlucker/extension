import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View, ViewStyle } from 'react-native'

import { Banner } from '@ambire-common/interfaces/banner'
import Search from '@common/components/Search'
import Wrapper, { WRAPPER_TYPES } from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { AccountPortfolio } from '@web/contexts/portfolioControllerStateContext'
import commonWebStyles from '@web/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

import useBanners from '../../hooks/useBanners'
import Collections from '../Collections'
import DashboardBanner from '../DashboardBanner'
import Tabs from '../Tabs'
import Tokens from '../Tokens'

interface Props {
  accountPortfolio: AccountPortfolio | null
  filterByNetworkId: any
}

// We do this instead of unmounting the component to prevent
// component rerendering when switching tabs.
const HIDDEN_STYLE: ViewStyle = { position: 'absolute', opacity: 0 }

const { isPopup } = getUiType()

const DashboardSectionList = ({ accountPortfolio, filterByNetworkId }: Props) => {
  const [containerHeight, setContainerHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const route = useRoute()
  const { t } = useTranslation()

  const [openTab, setOpenTab] = useState(() => {
    const params = new URLSearchParams(route?.search)

    return (params.get('tab') as 'tokens' | 'collectibles' | 'defi') || 'tokens'
  })
  const prevOpenTab = usePrevious(openTab)
  // To prevent initial load of all tabs but load them when requested by the user
  // Persist the rendered list of items for each tab once opened
  // This technique improves the initial loading speed of the dashboard
  const [initTab, setInitTab] = useState<{
    [key: string]: boolean
  }>({})

  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })

  const searchValue = watch('search')

  const allBanners = useBanners()

  useEffect(() => {
    if (openTab !== prevOpenTab && !initTab?.[openTab]) {
      setInitTab((prev) => ({ ...prev, [openTab]: true }))
    }
  }, [openTab, prevOpenTab, initTab])

  // We want to change the query param without refreshing the page.
  const handleChangeQuery = useCallback((tab: string) => {
    if (window.location.href.includes('?tab=')) {
      window.history.pushState(null, '', `${window.location.href.split('?')[0]}?tab=${tab}`)
      return
    }

    window.history.pushState(null, '', `${window.location.href}?tab=${tab}`)
  }, [])

  useEffect(() => {
    if (searchValue.length > 0 && openTab === 'collectibles') {
      handleChangeQuery('tokens')
      setOpenTab('tokens')
    }
  }, [searchValue, openTab, handleChangeQuery])

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

  const hasScroll = useMemo(() => contentHeight > containerHeight, [contentHeight, containerHeight])

  const SECTIONS_DATA = useMemo(
    () => [
      {
        header: null,
        renderItem: ({ item }: { item: Banner }) => {
          return <DashboardBanner {...item} />
        },
        data: allBanners || []
      },
      {
        header: () => (
          <View
            style={[
              commonWebStyles.contentContainer,
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
              placeholder={t('Search for tokens')}
            />
          </View>
        ),
        renderItem: () => (
          <>
            {!!initTab?.tokens && (
              <Tokens
                searchValue={searchValue}
                tokens={tokens || []}
                pointerEvents={openTab !== 'tokens' ? 'none' : 'auto'}
                style={openTab !== 'tokens' ? HIDDEN_STYLE : {}}
              />
            )}

            {!!initTab?.collectibles && (
              <Collections
                pointerEvents={openTab !== 'collectibles' ? 'none' : 'auto'}
                style={openTab !== 'collectibles' ? HIDDEN_STYLE : {}}
              />
            )}
          </>
        ),
        data: [{ id: 'tokens-list' }]
      }
    ],
    [
      handleChangeQuery,
      t,
      allBanners,
      control,
      openTab,
      initTab?.collectibles,
      initTab?.tokens,
      searchValue,
      tokens
    ]
  )

  return (
    <Wrapper
      type={WRAPPER_TYPES.SECTION_LIST}
      style={[spacings.ph0, flexbox.flex1, commonWebStyles.contentContainer]}
      contentContainerStyle={[
        spacings.ph0,
        isPopup && spacings.phSm,
        spacings.ptSm,
        hasScroll && spacings.prMi
      ]}
      sections={SECTIONS_DATA}
      keyExtractor={(item, index) => item?.id || item + index}
      renderItem={({ section: { renderItem } }: any) => renderItem}
      renderSectionHeader={({ section: { header } }) => (header ? header() : null)}
      stickySectionHeadersEnabled
      onLayout={(e) => {
        setContainerHeight(e.nativeEvent.layout.height)
      }}
      onContentSizeChange={(_, height) => {
        setContentHeight(height)
      }}
    />
  )
}

export default React.memo(DashboardSectionList)
