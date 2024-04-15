import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewProps } from 'react-native'
import { useModalize } from 'react-native-modalize'

import Text from '@common/components/Text'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import CollectibleModal from './CollectibleModal'
import { SelectedCollectible } from './CollectibleModal/CollectibleModal'
import Collection from './Collection'
import styles from './styles'

interface Props extends ViewProps {
  searchValue: string
  page: number
  setMaxPages: React.Dispatch<React.SetStateAction<number>>
}

const COLLECTIONS_PER_PAGE = 10

const Collections: FC<Props> = ({ searchValue, page, setMaxPages, ...rest }) => {
  const { accountPortfolio } = usePortfolioControllerState()
  const { ref: modalRef, open: openModal, close: closeModal } = useModalize()
  const { t } = useTranslation()
  const [selectedCollectible, setSelectedCollectible] = useState<SelectedCollectible | null>(null)

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
      (accountPortfolio?.collections || [])
        .filter(({ name, address }) => {
          if (!searchValue) return true
          return (
            name.toLowerCase().includes(searchValue.toLowerCase()) ||
            address.toLowerCase().includes(searchValue.toLowerCase())
          )
        })
        .filter((_, index) => index < page * COLLECTIONS_PER_PAGE),
    [accountPortfolio?.collections, page, searchValue]
  )

  useEffect(() => {
    if (!accountPortfolio?.collections.length) return

    setMaxPages(Math.floor(accountPortfolio.collections.length / COLLECTIONS_PER_PAGE))
  }, [setMaxPages, accountPortfolio?.collections?.length])

  return (
    <View {...rest}>
      <CollectibleModal
        modalRef={modalRef}
        handleClose={closeCollectibleModal}
        selectedCollectible={selectedCollectible}
      />
      {filteredPortfolioCollections.length ? (
        filteredPortfolioCollections.map(({ address, name, networkId, collectibles, priceIn }) => (
          <Collection
            address={address}
            networkId={networkId}
            key={address}
            name={name}
            collectibles={collectibles}
            priceIn={priceIn}
            openCollectibleModal={openCollectibleModal}
          />
        ))
      ) : (
        <Text fontSize={16} weight="medium" style={styles.noCollectibles}>
          {t("You don't have any collectibles (NFTs) yet")}
        </Text>
      )}
    </View>
  )
}

export default React.memo(Collections)
