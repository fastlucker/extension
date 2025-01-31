import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FlatListProps, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { Network } from '@ambire-common/interfaces/network'
import CollectibleModal, { SelectedCollectible } from '@common/components/CollectibleModal'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import DashboardBanners from '@common/modules/dashboard/components/DashboardBanners'
import DashboardPageScrollContainer from '@common/modules/dashboard/components/DashboardPageScrollContainer'
import TabsAndSearch from '@common/modules/dashboard/components/TabsAndSearch'
import { TabType } from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tab/Tab'
import { getDoesNetworkMatch } from '@common/utils/search'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import { getUiType } from '@web/utils/uiType'

import Collection from './Collection'
import CollectionsSkeleton from './CollectionsSkeleton'
import styles from './styles'

interface Props {
  openTab: TabType
  setOpenTab: React.Dispatch<React.SetStateAction<TabType>>
  initTab?: {
    [key: string]: boolean
  }
  sessionId: string
  onScroll: FlatListProps<any>['onScroll']
  networks: Network[]
}

const { isPopup } = getUiType()

const Collections: FC<Props> = ({
  openTab,
  setOpenTab,
  initTab,
  sessionId,
  onScroll,
  networks
}) => {
  const { portfolio, dashboardNetworkFilter } = useSelectedAccountControllerState()
  const { ref: modalRef, open: openModal, close: closeModal } = useModalize()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [selectedCollectible, setSelectedCollectible] = useState<SelectedCollectible | null>(null)
  const { control, watch, setValue } = useForm({ mode: 'all', defaultValues: { search: '' } })
  const searchValue = watch('search')

  const closeCollectibleModal = useCallback(() => {
    closeModal()
  }, [closeModal])

  const openCollectibleModal = useCallback(
    (collectible: SelectedCollectible) => {
      setSelectedCollectible(collectible)
      openModal()
    },
    [openModal]
  )

  const filteredPortfolioCollections = useMemo(
    () =>
      (portfolio?.collections || []).filter(({ name, address, networkId, collectibles }) => {
        let isMatchingNetwork = true
        let isMatchingSearch = true

        if (dashboardNetworkFilter) {
          isMatchingNetwork = networkId === dashboardNetworkFilter
        }

        if (searchValue) {
          const lowercaseSearch = searchValue.toLowerCase()
          isMatchingSearch =
            name.toLowerCase().includes(lowercaseSearch) ||
            address.toLowerCase().includes(lowercaseSearch) ||
            getDoesNetworkMatch({ networks, itemNetworkId: networkId, lowercaseSearch })
        }

        return isMatchingNetwork && isMatchingSearch && collectibles.length
      }),
    [portfolio?.collections, dashboardNetworkFilter, searchValue, networks]
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
          <Text fontSize={16} weight="medium" style={styles.noCollectibles}>
            {!searchValue &&
              !dashboardNetworkFilter &&
              t("You don't have any collectibles (NFTs) yet")}
            {!searchValue &&
              dashboardNetworkFilter &&
              t("You don't have any collectibles (NFTs) on this network")}
            {searchValue && t('No collectibles (NFTs) found')}
          </Text>
        )
      }

      if (item === 'skeleton') {
        return <CollectionsSkeleton amount={filteredPortfolioCollections.length ? 3 : 5} />
      }

      if (!initTab?.collectibles || !item || item === 'keep-this-to-avoid-key-warning') return null

      const { name, address, networkId, collectibles, priceIn } = item

      return (
        <Collection
          key={address}
          name={name}
          address={address}
          networkId={networkId}
          collectibles={collectibles}
          priceIn={priceIn}
          openCollectibleModal={openCollectibleModal}
          networks={networks}
        />
      )
    },
    [
      control,
      dashboardNetworkFilter,
      filteredPortfolioCollections.length,
      initTab?.collectibles,
      networks,
      openCollectibleModal,
      openTab,
      searchValue,
      setOpenTab,
      t,
      theme.primaryBackground,
      sessionId
    ]
  )

  const keyExtractor = useCallback((collectionOrElement: any) => {
    if (typeof collectionOrElement === 'string') return collectionOrElement

    return collectionOrElement.address
  }, [])

  useEffect(() => {
    setValue('search', '')
  }, [openTab, setValue])

  return (
    <>
      <CollectibleModal
        modalRef={modalRef}
        handleClose={closeCollectibleModal}
        selectedCollectible={selectedCollectible}
      />
      <DashboardPageScrollContainer
        tab="collectibles"
        openTab={openTab}
        onScroll={onScroll}
        ListHeaderComponent={<DashboardBanners />}
        data={[
          'header',
          ...(initTab?.collectibles ? filteredPortfolioCollections : []),
          !filteredPortfolioCollections.length && portfolio?.isReadyToVisualize ? 'empty' : '',
          !portfolio?.isReadyToVisualize ? 'skeleton' : 'keep-this-to-avoid-key-warning'
        ]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={isPopup ? 4 : 10}
        windowSize={15}
        bounces={false}
      />
    </>
  )
}

export default React.memo(Collections)
