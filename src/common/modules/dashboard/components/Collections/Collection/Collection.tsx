import React, { FC } from 'react'
import { View } from 'react-native'

import { networks } from '@ambire-common/consts/networks'
import { Collectible as CollectibleInterface } from '@ambire-common/libs/portfolio/interfaces'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import { SelectedCollectible } from '@common/modules/dashboard/components/Collections/CollectibleModal/CollectibleModal'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

import Collectible from './Collectible'
import getStyles from './styles'

interface Props {
  address: string
  name: string
  networkId: NetworkIconNameType
  collectibles: CollectibleInterface[]
  priceIn: {
    baseCurrency: string
    price: number
  }[]
  openCollectibleModal: (collectible: SelectedCollectible) => void
}

export const formatCollectiblePrice = ({
  baseCurrency,
  price
}: {
  baseCurrency: string
  price: number
}) => {
  if (baseCurrency === 'usd') {
    return `$${price}`
  }

  // @TODO: handle other currencies
  return `${price} ${baseCurrency.toUpperCase()}`
}

const { isTab } = getUiType()

const Collection: FC<Props> = ({
  address,
  name,
  networkId,
  collectibles,
  priceIn,
  openCollectibleModal
}) => {
  const networkData = networks.find(({ id }) => networkId === id)
  const { theme, styles } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.pbTy]}>
        <Text fontSize={isTab ? 16 : 14} weight="medium">
          {name}
        </Text>
        <Text style={spacings.mlTy} fontSize={isTab ? 16 : 14} appearance="secondaryText">
          ({collectibles.length})
        </Text>
      </View>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbSm]}>
        <View
          style={{
            backgroundColor: theme.primaryBackground,
            borderRadius: 8,
            width: isTab ? 20 : 16,
            height: isTab ? 20 : 16,
            ...(isTab ? spacings.mrTy : spacings.mrMi)
          }}
        >
          <NetworkIcon width={isTab ? 20 : 16} height={isTab ? 20 : 16} name={networkId} />
        </View>
        <Text fontSize={isTab ? 14 : 10} appearance="secondaryText">
          {networkData?.name || 'Unknown Network'}
          {priceIn && priceIn.length ? ` / Floor Price: ${formatCollectiblePrice(priceIn[0])}` : ''}
        </Text>
      </View>
      <View style={[flexbox.directionRow]}>
        {collectibles.map((collectible) => (
          <Collectible
            key={collectible.url + collectible.id}
            url={collectible.url}
            id={collectible.id}
            collectionData={{
              name,
              address,
              networkId,
              priceIn: priceIn.length ? priceIn[0] : null
            }}
            openCollectibleModal={openCollectibleModal}
          />
        ))}
      </View>
    </View>
  )
}

export default React.memo(Collection)
