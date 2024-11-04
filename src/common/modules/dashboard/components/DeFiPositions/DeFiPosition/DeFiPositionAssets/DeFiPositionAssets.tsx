import { formatUnits } from 'ethers'
import { FC } from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { Position } from '@ambire-common/libs/defiPositions/types'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import formatDecimals from '@common/utils/formatDecimals'

import DeFiPositionAssetsHeader from './DeFiPositionAssetsHeader'

const DeFiPositionAssets: FC<{
  assets: Position['assets']
  label: string
  networkId: Network['id']
}> = ({ assets, label, networkId }) => {
  return (
    <View style={flexbox.flex1}>
      <DeFiPositionAssetsHeader label={label} />
      <View style={spacings.ptMi}>
        {assets.map(({ symbol, amount, decimals, address, additionalData }) => (
          <View
            style={[flexbox.directionRow, spacings.phSm, spacings.pvTy, flexbox.alignCenter]}
            key={address}
          >
            <View style={[flexbox.directionRow, flexbox.flex1, flexbox.alignCenter]}>
              <TokenIcon
                width={24}
                height={24}
                withContainer={false}
                networkId={networkId}
                address={address}
                withNetworkIcon={false}
              />
              <Text fontSize={14} weight="semiBold">
                {symbol}
              </Text>
            </View>
            <Text style={flexbox.flex1} fontSize={14} weight="semiBold">
              {formatDecimals(Number(formatUnits(amount, decimals)), 'amount')}
            </Text>
            <Text style={{ flex: 0.5 }} fontSize={14} weight="semiBold">
              {additionalData?.APY ? `${formatDecimals(additionalData?.APY, 'amount')}%` : 'N/A'}
            </Text>
            <Text style={{ flex: 0.5, ...text.right }} fontSize={14} weight="semiBold">
              {additionalData?.positionInUSD || '$-'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default DeFiPositionAssets
