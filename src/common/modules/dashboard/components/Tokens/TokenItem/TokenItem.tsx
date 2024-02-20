import React from 'react'
import { Pressable, View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import RewardsIcon from '@common/assets/svg/RewardsIcon'
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
  const { styles } = useTheme(getStyles)
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
          {!!isRewards || !!isVesting ? (
            <View style={styles.tokenButtonIconWrapper}>
              <RewardsIcon width={40} height={40} />
            </View>
          ) : (
            <TokenIcon
              withContainer
              address={address}
              networkId={networkId}
              onGasTank={onGasTank}
              containerHeight={40}
              containerWidth={40}
              width={28}
              height={28}
            />
          )}
        </View>
        <View style={flexboxStyles.flex1}>
          <Text style={spacings.mrTy} fontSize={16} weight="number_bold" numberOfLines={1}>
            {balanceFormatted} {symbol}
          </Text>
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
            <Text weight="regular" shouldScale={false} fontSize={12}>
              {!!isRewards && t('rewards for claim')}
              {!!isVesting && t('claimable early supporters vestings')}
              {!isRewards && !isVesting && t('on')}{' '}
            </Text>
            <Text weight="regular" style={[spacings.mrMi]} fontSize={12}>
              {!!onGasTank && t('Gas Tank')}
              {!onGasTank && !isRewards && !isVesting && networkData?.name}
            </Text>
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

export default React.memo(TokenItem)
