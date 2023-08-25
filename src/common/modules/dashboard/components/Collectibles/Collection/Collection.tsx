import { Collectible } from 'ambire-common/src/libs/portfolio/interfaces'
import React, { FC, useEffect, useState } from 'react'
import { Image, Pressable, View } from 'react-native'

import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import { fetchCaught } from '@common/services/fetch'

import styles from './styles'

interface Props {
  address: string
  name: string
  networkId: NetworkIconNameType
  collectibles: Collectible[]
}

const handleFetchImage = async (url: string) => {
  const resp = await fetchCaught(url)

  return resp
}

export const handleCollectibleUri = (uri: string) => {
  let imageUri = uri
  if (!imageUri) return ''
  imageUri = uri.startsWith('data:application/json')
    ? imageUri.replace('data:application/json;utf8,', '')
    : imageUri

  if (imageUri.split('/').length === 1) return `https://ipfs.io/ipfs/${imageUri}`
  if (imageUri.split('/')[0] === 'data:image') return imageUri
  if (imageUri.startsWith('ipfs://'))
    return imageUri.replace(/ipfs:\/\/ipfs\/|ipfs:\/\//g, 'https://ipfs.io/ipfs/')
  if (imageUri.split('/')[2].endsWith('mypinata.cloud'))
    return `https://ipfs.io/ipfs/${imageUri.split('/').slice(4).join('/')}`

  return imageUri
}

const Collection: FC<Props> = ({ address, name, networkId, collectibles }) => {
  const [image, setImage] = useState('')
  const { navigate } = useNavigation()

  useEffect(() => {
    const uri = handleCollectibleUri(collectibles[0].url)

    handleFetchImage(uri).then((resp) => {
      const body = resp.body as any

      if (typeof body !== 'object' || body === null || !('image' in body)) return

      setImage(handleCollectibleUri(body.image))
    })
  }, [collectibles, image])

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
            image
          }
        })
      }}
    >
      <View style={styles.imageAndName}>
        <Image style={styles.image} source={{ uri: image }} />
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
