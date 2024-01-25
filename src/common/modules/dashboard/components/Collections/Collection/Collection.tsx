import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, View } from 'react-native'

import { networks } from '@ambire-common/consts/networks'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { Collectible } from '@ambire-common/libs/portfolio/interfaces'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useNft from '@common/hooks/useNft'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import ImageIcon from '@web/assets/svg/ImageIcon'

import styles from './styles'

interface Props {
  address: string
  name: string
  networkId: NetworkIconNameType
  collectibles: Collectible[]
  priceIn: {
    baseCurrency: string
    price: number
  }[]
}

const Collection: FC<Props> = ({ address, name, networkId, collectibles, priceIn }) => {
  const networkData: NetworkDescriptor | {} = networks.find(({ id }) => networkId === id) || {}
  const { t } = useTranslation()

  const [imageFailed, setImageFailed] = useState(false)
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
        hovered ? { backgroundColor: colors.melrose_15, borderColor: colors.scampi_20 } : {}
      ]}
      onPress={() => {
        navigate(ROUTES.collection, {
          state: {
            address,
            name,
            collectibles,
            image: data?.image || '',
            networkId,
            priceIn
          }
        })
      }}
    >
      <View style={styles.imageAndName}>
        {!imageFailed && !!data?.image && (
          <Image
            onError={() => setImageFailed(true)}
            style={styles.image}
            source={{ uri: data.image }}
          />
        )}
        {(imageFailed || !data?.image) && <ImageIcon width={30} height={30} style={styles.image} />}
        <Text weight="regular" style={styles.name} fontSize={14}>
          {name} ({collectibles.length})
        </Text>
      </View>
      <View style={styles.network}>
        <Text fontSize={12}>{t('on')}</Text>
        <NetworkIcon name={networkId} style={styles.networkIcon} />
        <Text style={styles.networkName} fontSize={12}>
          {'name' in networkData ? networkData.name : t('Unknown network')}
        </Text>
      </View>
    </Pressable>
  )
}

export default Collection
