import { FC } from 'react'
import { View } from 'react-native'

import { AssetType, Position } from '@ambire-common/libs/defiPositions/types'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import DeFiPositionAssets from './DeFiPositionAssets'
import getStyles from './styles'

type Props = Position & {
  positionInUsd?: string
}

const ASSET_TYPE_TO_LABEL = {
  [AssetType.Borrow]: 'Borrowed',
  [AssetType.Collateral]: 'Collateral',
  [AssetType.Liquidity]: 'Supplied'
}

const DeFiPositionExpanded: FC<Props> = ({
  positionType,
  providerName,
  networkId,
  positionInUsd,
  additionalData,
  assets
}) => {
  const { styles } = useTheme(getStyles)

  const suppliedAssets = assets.filter(
    (asset) => asset.type === AssetType.Liquidity || asset.type === AssetType.Collateral
  )

  const borrowedAssets = assets.filter((asset) => asset.type === AssetType.Borrow)

  return (
    <View style={styles.expandedPosition}>
      <View
        style={[
          flexbox.directionRow,
          spacings.mb,
          spacings.phSm,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween
        ]}
      >
        <View style={[flexbox.directionRow, flexbox.alignCenter]}>
          <Text fontSize={14} weight="semiBold">
            {positionType}
          </Text>
          <Text fontSize={12} appearance="secondaryText" style={spacings.mlMi} selectable>
            #{additionalData.positionId}
          </Text>
        </View>
        <Text fontSize={14} weight="semiBold">
          {positionInUsd || '$-'}
        </Text>
      </View>
      {suppliedAssets.length > 0 && (
        <DeFiPositionAssets
          networkId={networkId}
          providerName={providerName}
          assets={suppliedAssets}
          label={ASSET_TYPE_TO_LABEL[AssetType.Liquidity]}
        />
      )}
      {borrowedAssets.length > 0 && (
        <DeFiPositionAssets
          networkId={networkId}
          providerName={providerName}
          assets={borrowedAssets}
          label={ASSET_TYPE_TO_LABEL[AssetType.Borrow]}
        />
      )}
    </View>
  )
}

export default DeFiPositionExpanded
