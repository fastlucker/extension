import React, { FC } from 'react'
import { View } from 'react-native'

import { AssetType, Position, PositionsByProvider } from '@ambire-common/libs/defiPositions/types'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings, { SPACING_MI } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import DeFiPositionAssets from './DeFiPositionAssets'
import Badge from './DeFiPositionHeader/Badge'

type Props = Omit<PositionsByProvider, 'iconUrl' | 'positions' | 'positionInUSD'> &
  Position & {
    positionInUSD?: string
    withTopBorder?: boolean
  }

const ASSET_TYPE_TO_LABEL = {
  [AssetType.Borrow]: 'Borrowed',
  [AssetType.Collateral]: 'Collateral',
  [AssetType.Liquidity]: 'Supplied',
  [AssetType.Reward]: 'Rewards'
}

const DeFiPosition: FC<Props> = ({
  withTopBorder,
  providerName,
  chainId,
  positionInUSD,
  additionalData,
  assets
}) => {
  const { inRange, name, positionIndex } = additionalData
  const suppliedAssets = assets.filter(
    (asset) => asset.type === AssetType.Liquidity || asset.type === AssetType.Collateral
  )
  const borrowedAssets = assets.filter((asset) => asset.type === AssetType.Borrow)

  const rewardAssets = assets.filter((asset) => asset.type === AssetType.Reward)

  const { theme } = useTheme()

  return (
    <View
      style={{
        borderTopWidth: withTopBorder ? 1 : 0,
        borderTopColor: theme.secondaryBorder,
        paddingBottom: !withTopBorder ? SPACING_MI : 0
      }}
    >
      <View
        style={[
          flexbox.directionRow,
          spacings.phSm,
          spacings.pvSm,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween
        ]}
      >
        <View style={[flexbox.directionRow, flexbox.alignCenter]}>
          <Text fontSize={14} weight="semiBold">
            {name}
          </Text>
          {!!positionIndex && (
            <Text
              fontSize={12}
              appearance="secondaryText"
              style={[spacings.mlMi, spacings.mrTy]}
              selectable
            >
              #{positionIndex}
            </Text>
          )}
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
          chainId={chainId}
          assets={suppliedAssets}
          label={ASSET_TYPE_TO_LABEL[AssetType.Liquidity]}
        />
      )}
      {borrowedAssets.length > 0 && (
        <DeFiPositionAssets
          chainId={chainId}
          assets={borrowedAssets}
          label={ASSET_TYPE_TO_LABEL[AssetType.Borrow]}
        />
      )}
      {rewardAssets.length > 0 && (
        <DeFiPositionAssets
          chainId={chainId}
          assets={rewardAssets}
          label={ASSET_TYPE_TO_LABEL[AssetType.Reward]}
        />
      )}
    </View>
  )
}

export default React.memo(DeFiPosition)
