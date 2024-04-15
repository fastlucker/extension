import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FlatList, FlatListProps, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { getUiType } from '@web/utils/uiType'

import DashboardBanners from '../DashboardBanners'
import TabsAndSearch from '../TabsAndSearch'
import { TabType } from '../TabsAndSearch/Tabs/Tab/Tab'
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
  style: FlatListProps<any>['style']
  contentContainerStyle: FlatListProps<any>['contentContainerStyle']
  onScroll: FlatListProps<any>['onScroll']
}

const { isPopup } = getUiType()

const Collections: FC<Props> = ({
  openTab,
  setOpenTab,
  initTab,
  style,
  contentContainerStyle,
  onScroll
}) => {
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
  const flatlistRef = useRef<FlatList | null>(null)

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

  useEffect(() => {
    setValue('search', '')

    if (!flatlistRef.current) return

    // Fixes weird behaviour that occurs when you scroll in one tab and then move to another and back.
    flatlistRef.current?.scrollToOffset({
      offset: 0,
      animated: false
    })
  }, [openTab, setValue])

  return (
    <>
      <CollectibleModal
        modalRef={modalRef}
        handleClose={closeCollectibleModal}
        selectedCollectible={selectedCollectible}
      />
      <FlatList
        ref={flatlistRef}
        style={style}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        ListHeaderComponent={<DashboardBanners />}
        data={[
          'header',
          ...(initTab?.collectibles ? filteredPortfolioCollections : []),
          !filteredPortfolioCollections.length ? 'empty' : ''
        ]}
        renderItem={({ item }) => {
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
        }}
        keyExtractor={(collectionOrElement) => {
          if (typeof collectionOrElement === 'string') return collectionOrElement

          return collectionOrElement.address
        }}
        stickyHeaderIndices={[1]} // Makes the header sticky
        initialNumToRender={isPopup ? 4 : 10}
        removeClippedSubviews
        windowSize={15}
      />
    </>
  )
}

export default React.memo(Collections)
