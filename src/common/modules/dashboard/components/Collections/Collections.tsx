import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FlatListProps, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import DashboardBanners from '@common/modules/dashboard/components/DashboardBanners'
import DashboardPageScrollContainer from '@common/modules/dashboard/components/DashboardPageScrollContainer'
import TabsAndSearch from '@common/modules/dashboard/components/TabsAndSearch'
import { TabType } from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tab/Tab'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { getUiType } from '@web/utils/uiType'

import CollectibleModal from './CollectibleModal'
import { SelectedCollectible } from './CollectibleModal/CollectibleModal'
import Collection from './Collection'
import styles from './styles'

interface Props {
  openTab: TabType
  setOpenTab: React.Dispatch<React.SetStateAction<TabType>>
  initTab?: {
    [key: string]: boolean
  }
  onScroll: FlatListProps<any>['onScroll']
}

const { isPopup } = getUiType()

const Collections: FC<Props> = ({ openTab, setOpenTab, initTab, onScroll }) => {
  const { accountPortfolio } = usePortfolioControllerState()
  const { ref: modalRef, open: openModal, close: closeModal } = useModalize()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [selectedCollectible, setSelectedCollectible] = useState<SelectedCollectible | null>(null)
  const { control, watch, setValue } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
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
      (accountPortfolio?.collections || []).filter(({ name, address }) => {
        if (!searchValue) return true

        return (
          name.toLowerCase().includes(searchValue.toLowerCase()) ||
          address.toLowerCase().includes(searchValue.toLowerCase())
        )
      }),
    [accountPortfolio?.collections, searchValue]
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
          <Text fontSize={16} weight="medium" style={styles.noCollectibles}>
            {t("You don't have any collectibles (NFTs) yet")}
          </Text>
        )
      }

      if (!initTab?.collectibles || !item) return null

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
        />
      )
    },
    [
      control,
      initTab?.collectibles,
      openCollectibleModal,
      openTab,
      setOpenTab,
      t,
      theme.primaryBackground
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
          !filteredPortfolioCollections.length ? 'empty' : ''
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
