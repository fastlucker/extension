import { formatUnits } from 'ethers'
import React from 'react'
import { Pressable, View } from 'react-native'

import { networks } from '@ambire-common/consts/networks'
import GasTankIcon from '@common/assets/svg/GasTankIcon'
import RewardsIcon from '@common/assets/svg/RewardsIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

import getStyles from './styles'

// TODO: customize token component for gas token, wallet rewards token. Each of them has different button and styling
// TODO: correct props once connected with portfolio controller
const TokenItem = ({
  symbol,
  amount,
  priceIn,
  decimals,
  address,
  networkId,
  onGasTank,
  rewardsType
}: any) => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()

  const networkData = networks.find(({ id }) => networkId === id)

  const balance = parseFloat(formatUnits(amount, decimals))
  const price =
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0
  const balanceUSD = balance * price
  const rewards = rewardsType === 'wallet-rewards'
  const vesting = rewardsType === 'wallet-vesting'

  if ((rewards || vesting) && !balance) return null

  return (
    <Pressable
      // className={rewards || vesting ? 'rewards-token-container' : 'token-container'}
      style={({ hovered }: any) => [styles.container, hovered ? styles.containerHovered : {}]}
    >
      <View style={[flexboxStyles.directionRow, { flex: 1.5 }]}>
        <View style={[spacings.mr, flexboxStyles.justifyCenter]}>
          {rewards || vesting ? (
            <View style={styles.tokenButtonIconWrapper}>
              <RewardsIcon width={24} height={24} />
            </View>
          ) : (
            <TokenIcon
              withContainer
              address={address}
              networkId={networkId}
              containerHeight={40}
              containerWidth={40}
              width={24}
              height={24}
            />
          )}
        </View>
        <View>
          <Text style={[spacings.mrTy]} fontSize={16} weight="number_bold" numberOfLines={1}>
            {balance.toFixed(balance < 1 ? 8 : 4)} {symbol}
          </Text>
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
            <Text weight="regular" shouldScale={false} fontSize={12}>
              {rewards && t('rewards for claim')}
              {vesting && t('claimable early supporters vesting')}
              {!rewards && !vesting && t('on')}{' '}
            </Text>
            <Text weight="regular" style={[spacings.mrMi]} fontSize={12}>
              {onGasTank && t('Gas Tank')}
              {!onGasTank && !rewards && !vesting && networkData?.name}
            </Text>
            {onGasTank && <GasTankIcon width={18} height={18} color={theme.primary} />}
            {!onGasTank && !rewards && !vesting && (
              <NetworkIcon
                name={networkId}
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: theme.secondaryBackground,
                  borderRadius: 12
                }}
              />
            )}
          </View>
        </View>
      </View>
      <Text fontSize={16} weight="number_regular" style={{ flex: 0.7 }}>
        ${price.toFixed(price < 1 ? 4 : 2)}
      </Text>
      <Text fontSize={16} weight="number_bold" style={{ flex: 0.8, textAlign: 'right' }}>
        ${balanceUSD.toFixed(balanceUSD < 1 ? 4 : 2)}
      </Text>
    </Pressable>
  )
}

export default TokenItem
