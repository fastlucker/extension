import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FlatListProps, View } from 'react-native'

import { NetworkId } from '@ambire-common/interfaces/network'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import DashboardBanners from '@common/modules/dashboard/components/DashboardBanners'
import DashboardPageScrollContainer from '@common/modules/dashboard/components/DashboardPageScrollContainer'
import TabsAndSearch from '@common/modules/dashboard/components/TabsAndSearch'
import { TabType } from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tab/Tab'
import useDefiPositionsControllerState from '@web/hooks/useDeFiPositionsControllerState'
import { getUiType } from '@web/utils/uiType'

import DeFiPosition from './DeFiPosition/DeFiPosition'
import styles from './styles'

interface Props {
  openTab: TabType
  setOpenTab: React.Dispatch<React.SetStateAction<TabType>>
  initTab?: {
    [key: string]: boolean
  }
  filterByNetworkId: NetworkId
  onScroll: FlatListProps<any>['onScroll']
}

const { isPopup } = getUiType()

const DeFiPositions: FC<Props> = ({
  openTab,
  setOpenTab,
  initTab,
  onScroll,
  filterByNetworkId
}) => {
  const { control, watch, setValue } = useForm({ mode: 'all', defaultValues: { search: '' } })
  const { t } = useTranslation()
  const { theme } = useTheme()
  const searchValue = watch('search')
  const { positions, updateDefiPositionsStatus } = useDefiPositionsControllerState()

  useEffect(() => {
    setValue('search', '')
  }, [openTab, setValue])

  const filteredPositions = useMemo(
    () =>
      (positions || []).filter(({ network, providerName }) => {
        let isMatchingNetwork = true
        let isMatchingSearch = true

        if (filterByNetworkId) {
          isMatchingNetwork = network === filterByNetworkId
        }

        if (searchValue) {
          isMatchingSearch = providerName.toLowerCase().includes(searchValue.toLowerCase())
        }

        return isMatchingNetwork && isMatchingSearch
      }),
    [positions, filterByNetworkId, searchValue]
  )

  const renderItem = useCallback(
    ({ item }: any) => {
      if (item === 'header') {
        return (
          <View style={{ backgroundColor: theme.primaryBackground }}>
            <TabsAndSearch openTab={openTab} setOpenTab={setOpenTab} searchControl={control} />
          </View>
        )
      }

      if (item === 'empty') {
        return (
          <Text fontSize={16} weight="medium" style={styles.noPositions}>
            {!searchValue && !filterByNetworkId && t("You don't have any DeFi positions yet")}
            {!searchValue &&
              filterByNetworkId &&
              t("You don't have any DeFi positions on this network")}
            {searchValue && t('No DeFi positions found')}
          </Text>
        )
      }

      if (item === 'skeleton') {
        return <Text>TODO: Skeleton</Text>
      }

      if (!initTab?.defi || !item || item === 'keep-this-to-avoid-key-warning') return null

      console.log('item', item)

      return <DeFiPosition key={item.providerName + item.network} {...item} />
    },
    [
      control,
      filterByNetworkId,
      initTab?.defi,
      openTab,
      searchValue,
      setOpenTab,
      t,
      theme.primaryBackground
    ]
  )

  const keyExtractor = useCallback((positionOrElement: any) => {
    if (typeof positionOrElement === 'string') return positionOrElement

    return positionOrElement.additionalData.positionId
  }, [])

  return (
    <DashboardPageScrollContainer
      tab="defi"
      openTab={openTab}
      ListHeaderComponent={<DashboardBanners />}
      data={[
        'header',
        updateDefiPositionsStatus === 'LOADING' && !positions?.length
          ? 'skeleton'
          : 'keep-this-to-avoid-key-warning',
        ...(initTab?.defi ? filteredPositions : []),
        !filteredPositions.length ? 'empty' : ''
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
