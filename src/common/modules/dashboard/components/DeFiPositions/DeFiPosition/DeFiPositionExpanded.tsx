import React, { FC } from 'react'
import { View } from 'react-native'

import { AssetType, Position, PositionsByProvider } from '@ambire-common/libs/defiPositions/types'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import DeFiPositionAssets from './DeFiPositionAssets'
import Badge from './DeFiPositionHeader/Badge'
import getStyles from './styles'

type Props = Omit<PositionsByProvider, 'positions' | 'positionInUSD'> &
  Position & {
    positionInUSD?: string
  }

const ASSET_TYPE_TO_LABEL = {
  [AssetType.Borrow]: 'Borrowed',
  [AssetType.Collateral]: 'Collateral',
  [AssetType.Liquidity]: 'Supplied'
}

const POSITION_TYPE_TO_NAME = {
  lending: 'Lending',
  'liquidity-pool': 'Liquidity Pool'
}

const DeFiPositionExpanded: FC<Props> = ({
  type,
  id,
  providerName,
  networkId,
  positionInUSD,
  additionalData,
  assets
}) => {
  const { styles } = useTheme(getStyles)
  const { inRange } = additionalData
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
            {POSITION_TYPE_TO_NAME[type]}
          </Text>
          <Text
            fontSize={12}
            appearance="secondaryText"
            style={[spacings.mlMi, spacings.mrTy]}
            selectable
          >
            #{id}
          </Text>
          {typeof inRange === 'boolean' && (
            <Badge
              text={inRange ? 'In Range' : 'Out of Range'}
              type={inRange ? 'success' : 'error'}
            />
          )}
        </View>
        <Text fontSize={14} weight="semiBold">
          {positionInUSD || '$-'}
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

export default React.memo(DeFiPositionExpanded)
