import { Collectible as CollectibleType } from 'ambire-common/src/libs/portfolio/interfaces'
import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import Collectible from '@web/modules/collectibles/components/Collectible/Collectible'

import TabHeader from '../../components/TabHeader'
import styles from './styles'

const CollectionScreen = () => {
  const route = useRoute()

  if (!route.state) return null

  const state = route.state

  return (
    <>
      <TabHeader text={route.state.name} image={state.image} />
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
                  address: state.address
                }}
              />
            ))
          ) : (
            <Text>No collectibles found</Text>
          )}
        </View>
      </Wrapper>
    </>
  )
}

export default CollectionScreen
