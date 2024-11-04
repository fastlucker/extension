import { formatUnits } from 'ethers'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { Position } from '@ambire-common/libs/defiPositions/types'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import formatDecimals from '@common/utils/formatDecimals'

import getStyles from './styles'

const DeFiPositionAssets: FC<{
  assets: Position['assets']
  label: string
  networkId: Network['id']
}> = ({ assets, label, networkId }) => {
  const { t } = useTranslation()
  const { theme } = useTheme(getStyles)

  return (
    <View style={flexbox.flex1}>
      <View
        style={[
          flexbox.directionRow,
          spacings.phSm,
          spacings.pvMi,
          flexbox.flex1,
          flexbox.alignCenter,
          {
            backgroundColor: theme.quaternaryBackground
          }
        ]}
      >
        <Text
          style={[flexbox.flex1, text.uppercase]}
          fontSize={12}
          appearance="secondaryText"
          weight="medium"
        >
          {label}
        </Text>
        <Text style={flexbox.flex1} fontSize={12} appearance="secondaryText" weight="medium">
          {t('AMOUNT')}
        </Text>

        <Text
          style={{
            flex: 0.5
          }}
          fontSize={12}
          appearance="secondaryText"
          weight="medium"
        >
          {t('APY')}
        </Text>
        <Text
          style={[
            {
              flex: 0.5
            },
            text.right
          ]}
          fontSize={12}
          appearance="secondaryText"
          weight="medium"
        >
          {t('USD VALUE')}
        </Text>
      </View>
      <View style={spacings.ptMi}>
        {assets.map(({ symbol, amount, decimals, address, additionalData }) => (
          <View
            style={[flexbox.directionRow, spacings.phSm, spacings.pvTy, flexbox.alignCenter]}
            key={address}
          >
            <View style={[flexbox.directionRow, flexbox.flex1, flexbox.alignCenter]}>
              <TokenIcon networkId={networkId} address={address} />
              <Text fontSize={14} weight="semiBold">
                {symbol}
              </Text>
            </View>
            <Text style={flexbox.flex1} fontSize={14} weight="semiBold">
              {formatDecimals(Number(formatUnits(amount, decimals)), 'amount')}
            </Text>
            <Text style={{ flex: 0.5 }} fontSize={14} weight="semiBold">
              {additionalData?.APY ? formatDecimals(additionalData?.APY, 'amount') : 'N/A'}
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
