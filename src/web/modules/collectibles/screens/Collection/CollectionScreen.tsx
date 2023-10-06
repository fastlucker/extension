import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Collectible as CollectibleType } from '@ambire-common/libs/portfolio/interfaces'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import colors from '@common/styles/colors'
import Collectible from '@web/modules/collectibles/components/Collectible/Collectible'
import TabHeader from '@web/modules/router/components/TabHeader'

import styles from './styles'

const CollectionScreen = () => {
  const route = useRoute()
  const { t } = useTranslation()

  if (!route.state) return null

  const state = route.state

  return (
    <>
      <TabHeader
        style={{ backgroundColor: colors.zircon }}
        pageTitle={route.state.name}
        image={state.image}
      />
      <Wrapper style={styles.container}>
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
      </Wrapper>
    </>
  )
}

export default CollectionScreen
