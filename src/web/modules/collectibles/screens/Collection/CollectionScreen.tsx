import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Collectible as CollectibleType } from '@ambire-common/libs/portfolio/interfaces'
import BackButton from '@common/components/BackButton'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { TabLayoutContainer } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import Collectible from '@web/modules/collectibles/components/Collectible/Collectible'

import getStyles from './styles'

const CollectionScreen = () => {
  const route = useRoute()
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()

  if (!route.state) return null

  const state = route.state

  return (
    <TabLayoutContainer
      header={
        <Header
          customTitle={state.name}
          image={state.image}
          withPopupBackButton
          withAmbireLogo
          withBackButton={false}
          mode="image-and-title"
        />
      }
      footer={<BackButton />}
      hideFooterInPopup
    >
      <View style={styles.contentContainer}>
        {state?.collectibles?.length ? (
          state.collectibles.map((collectible: CollectibleType) => (
            <Collectible
              key={collectible.url}
              url={collectible.url}
              id={collectible.id}
              collectionData={{
                name: state.name,
                image: state.image,
                address: state.address,
                networkId: state.networkId
              }}
              priceIn={state.priceIn}
            />
          ))
        ) : (
          <Text fontSize={16} weight="medium" style={styles.noCollectibles}>
            {t('No collectibles found')}
          </Text>
        )}
      </View>
    </TabLayoutContainer>
  )
}

export default CollectionScreen
