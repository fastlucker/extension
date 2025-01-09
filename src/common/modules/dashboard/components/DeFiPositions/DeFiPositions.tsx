import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FlatListProps, View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import DashboardBanners from '@common/modules/dashboard/components/DashboardBanners'
import DashboardPageScrollContainer from '@common/modules/dashboard/components/DashboardPageScrollContainer'
import TabsAndSearch from '@common/modules/dashboard/components/TabsAndSearch'
import { TabType } from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tab/Tab'
import { getDoesNetworkMatch } from '@common/utils/search'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import { getUiType } from '@web/utils/uiType'

import DefiPositionsSkeleton from './DefiPositionsSkeleton'
import DeFiPosition from './DeFiProviderPosition'
import styles from './styles'

interface Props {
  openTab: TabType
  setOpenTab: React.Dispatch<React.SetStateAction<TabType>>
  initTab?: { [key: string]: boolean }
  sessionId: string
  onScroll: FlatListProps<any>['onScroll']
}

const { isPopup } = getUiType()

const DeFiPositions: FC<Props> = ({ openTab, setOpenTab, initTab, sessionId, onScroll }) => {
  const { control, watch, setValue } = useForm({ mode: 'all', defaultValues: { search: '' } })
  const { t } = useTranslation()
  const { theme } = useTheme()
  const searchValue = watch('search')
  const { networks } = useNetworksControllerState()
  const { defiPositions, areDefiPositionsLoading, dashboardNetworkFilter } =
    useSelectedAccountControllerState()

  useEffect(() => {
    setValue('search', '')
  }, [openTab, setValue])

  const filteredPositions = useMemo(
    () =>
      defiPositions.filter(({ networkId, providerName }) => {
        let isMatchingNetwork = true
        let isMatchingSearch = true

        if (dashboardNetworkFilter) {
          isMatchingNetwork = networkId === dashboardNetworkFilter
        }

        if (searchValue) {
          const lowercaseSearch = searchValue.toLowerCase()
          isMatchingSearch =
            providerName.toLowerCase().includes(lowercaseSearch) ||
            getDoesNetworkMatch({
              networks,
              itemNetworkId: networkId,
              lowercaseSearch
            })
        }

        return isMatchingNetwork && isMatchingSearch
      }),
    [defiPositions, dashboardNetworkFilter, searchValue, networks]
  )

  const renderItem = useCallback(
    ({ item }: any) => {
      if (item === 'header') {
        return (
          <View style={{ backgroundColor: theme.primaryBackground }}>
            <TabsAndSearch
              openTab={openTab}
              setOpenTab={setOpenTab}
              searchControl={control}
              sessionId={sessionId}
            />
          </View>
        )
      }

      if (item === 'empty') {
        return (
          <Text fontSize={16} weight="medium" style={styles.noPositions}>
            {!searchValue && !dashboardNetworkFilter && t("You don't have any DeFi positions yet")}
            {!searchValue &&
              dashboardNetworkFilter &&
              t("You don't have any DeFi positions on this network")}
            {searchValue && t('No DeFi positions found')}
          </Text>
        )
      }

      if (item === 'skeleton') {
        return <DefiPositionsSkeleton amount={4} />
      }

      if (!initTab?.defi || !item || item === 'keep-this-to-avoid-key-warning') return null

      return <DeFiPosition key={item.providerName + item.network} {...item} />
    },
    [
      control,
      dashboardNetworkFilter,
      initTab?.defi,
      openTab,
      searchValue,
      setOpenTab,
      t,
      theme,
      sessionId
    ]
  )

  const keyExtractor = useCallback((positionOrElement: any) => {
    if (typeof positionOrElement === 'string') return positionOrElement

    return `${positionOrElement.providerName}-${positionOrElement.networkId}`
  }, [])

  return (
    <DashboardPageScrollContainer
      tab="defi"
      openTab={openTab}
      ListHeaderComponent={<DashboardBanners />}
      data={[
        'header',
        areDefiPositionsLoading && !defiPositions?.length
          ? 'skeleton'
          : 'keep-this-to-avoid-key-warning',
        ...(initTab?.defi ? filteredPositions : []),
        !areDefiPositionsLoading && !filteredPositions.length ? 'empty' : ''
      ]}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={isPopup ? 5 : 2.5}
      initialNumToRender={isPopup ? 10 : 20}
      windowSize={9} // Larger values can cause performance issues.
      onScroll={onScroll}
    />
  )
}

export default React.memo(DeFiPositions)
