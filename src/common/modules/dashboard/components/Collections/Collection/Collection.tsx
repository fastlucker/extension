import React, { FC, useMemo } from 'react'
import { View } from 'react-native'

import Collectible from '@common/components/Collectible'
import { SelectedCollectible } from '@common/components/CollectibleModal'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconIdType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

interface Props {
  address: string
  name: string
  networkId: NetworkIconIdType
  collectibles: bigint[]
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
    return `$${formatDecimals(price)}`
  }

  // @TODO: handle other currencies
  return `${formatDecimals(price)} ${baseCurrency.toUpperCase()}`
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
  const { theme, styles } = useTheme(getStyles)
  const settingsState = useSettingsControllerState()

  const networkData = useMemo(() => {
    return settingsState.networks.find(({ id }) => networkId === id)
  }, [networkId, settingsState.networks])

  return (
    <View style={styles.container}>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.pbTy]}>
        <Text testID="collection-item" fontSize={isTab ? 16 : 14} weight="medium">
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
          <NetworkIcon size={isTab ? 20 : 16} id={networkId} />
        </View>
        <Text fontSize={isTab ? 14 : 10} appearance="secondaryText">
          {networkData?.name || 'Unknown Network'}
          {priceIn && priceIn.length ? ` / Floor Price: ${formatCollectiblePrice(priceIn[0])}` : ''}
        </Text>
      </View>
      <View style={[flexbox.directionRow, flexbox.wrap]}>
        {collectibles.map((collectible) => (
          <Collectible
            style={{ marginBottom: '12px', marginRight: '8px' }}
            key={address + collectible}
            id={collectible}
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
