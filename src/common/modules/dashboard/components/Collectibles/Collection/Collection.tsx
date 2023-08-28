import { Collectible } from 'ambire-common/src/libs/portfolio/interfaces'
import React, { FC } from 'react'
import { Image, Pressable, View } from 'react-native'

import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useNft from '@common/hooks/useNft'
import { ROUTES } from '@common/modules/router/constants/common'

import styles from './styles'

interface Props {
  address: string
  name: string
  networkId: NetworkIconNameType
  collectibles: Collectible[]
}

const Collection: FC<Props> = ({ address, name, networkId, collectibles }) => {
  const { data } = useNft({
    address,
    networkId,
    id: collectibles[0].id
  })
  const { navigate } = useNavigation()

  return (
    <Pressable
      style={({ hovered }: any) => [
        styles.container,
        hovered ? { backgroundColor: '#B6B9FF26', borderColor: '#6770B333' } : {}
      ]}
      onPress={() => {
        navigate(ROUTES.collection, {
          state: {
            address,
            name,
            collectibles,
            image: data?.image || '',
            networkId
          }
        })
      }}
    >
      <View style={styles.imageAndName}>
        <Image style={styles.image} source={{ uri: data?.image || '' }} />
        <Text weight="regular" style={styles.name} fontSize={14}>
          {name} ({collectibles.length})
        </Text>
      </View>
      <View style={styles.network}>
        <Text shouldScale={false} fontSize={12}>
          on
        </Text>
        <NetworkIcon name={networkId} style={styles.networkIcon} />
        <Text style={styles.networkName} shouldScale={false} fontSize={12}>
          {networkId}
        </Text>
      </View>
    </Pressable>
  )
}

export default Collection
