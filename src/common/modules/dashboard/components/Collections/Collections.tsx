import React, { FC, useCallback, useState } from 'react'
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
}

const Collections: FC<Props> = ({ searchValue, ...rest }) => {
  const { accountPortfolio } = usePortfolioControllerState()
  const { ref: modalRef, open: openModal, close: closeModal } = useModalize()
  const { t } = useTranslation()
  const [selectedCollectible, setSelectedCollectible] = useState<SelectedCollectible | null>(null)

  const closeCollectibleModal = useCallback(() => {
    setSelectedCollectible(null)
    closeModal()
  }, [closeModal])

  const openCollectibleModal = useCallback(
    (collectible: SelectedCollectible) => {
      setSelectedCollectible(collectible)
      openModal()
    },
    [openModal]
  )

  return (
    <View {...rest}>
      <CollectibleModal
        modalRef={modalRef}
        handleClose={closeCollectibleModal}
        selectedCollectible={selectedCollectible}
      />
      {accountPortfolio?.collections?.length ? (
        accountPortfolio.collections
          .filter(({ name, address }) => {
            if (!searchValue) return true
            return (
              name.toLowerCase().includes(searchValue.toLowerCase()) ||
              address.toLowerCase().includes(searchValue.toLowerCase())
            )
          })
          .map(({ address, name, networkId, collectibles, priceIn }) => (
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
