import React from 'react'
import { Pressable, View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import GasTankIcon from '@common/assets/svg/GasTankIcon'
import RewardsIcon from '@common/assets/svg/RewardsIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import getTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

import getStyles from './styles'

// TODO: customize token component for gas token, wallet isRewards token. Each of them has different button and styling
// TODO: correct props once connected with portfolio controller
const TokenItem = ({
  token,
  handleTokenSelect
}: {
  token: TokenResult
  handleTokenSelect: ({ address, networkId, flags }: TokenResult) => void
}) => {
  const { symbol, address, networkId, flags } = token
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const onGasTank = flags.onGasTank

  const {
    balanceFormatted,
    balance,
    priceUSDFormatted,
    balanceUSDFormatted,
    isVesting,
    networkData,
    isRewards
  } = getTokenDetails(token)

  if ((isRewards || isVesting) && !balance) return null

  return (
    <Pressable
      onPress={() => handleTokenSelect(token)}
      style={({ hovered }: any) => [styles.container, hovered ? styles.containerHovered : {}]}
    >
      <View style={[flexboxStyles.directionRow, { flex: 1.5 }]}>
        <View style={[spacings.mr, flexboxStyles.justifyCenter]}>
          {isRewards || isVesting ? (
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
            {balanceFormatted} {symbol}
          </Text>
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
            <Text weight="regular" shouldScale={false} fontSize={12}>
              {isRewards && t('rewards for claim')}
              {isVesting && t('claimable early supporters vestings')}
              {!isRewards && !isVesting && t('on')}{' '}
            </Text>
            <Text weight="regular" style={[spacings.mrMi]} fontSize={12}>
              {onGasTank && t('Gas Tank')}
              {!onGasTank && !isRewards && !isVesting && networkData?.name}
            </Text>
            {onGasTank && <GasTankIcon width={18} height={18} color={theme.primary} />}
            {!onGasTank && !isRewards && !isVesting && (
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
        ${priceUSDFormatted}
      </Text>
      <Text fontSize={16} weight="number_bold" style={{ flex: 0.8, textAlign: 'right' }}>
        ${balanceUSDFormatted}
      </Text>
    </Pressable>
  )
}

export default TokenItem
