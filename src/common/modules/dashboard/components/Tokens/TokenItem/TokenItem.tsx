import React from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { TokenResult } from '@ambire-common/libs/portfolio'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import RewardsIcon from '@common/assets/svg/RewardsIcon'
import BottomSheet from '@common/components/BottomSheet'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import getTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import TokenDetails from '../TokenDetails'
import getStyles from './styles'

// TODO: customize token component for gas token, wallet isRewards token. Each of them has different button and styling
// TODO: correct props once connected with portfolio controller
const TokenItem = ({
  token,
  tokenPreferences
}: {
  token: TokenResult
  tokenPreferences: CustomToken[]
}) => {
  const {
    symbol,
    address,
    networkId,
    flags: { onGasTank }
  } = token
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()

  const { styles, theme } = useTheme(getStyles)
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  // const [selectedToken, setSelectedToken] = useState<TokenResult | null>(null)
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    }
  })

  const {
    balanceFormatted,
    balance,
    priceUSDFormatted,
    balanceUSDFormatted,
    isVesting,
    networkData,
    isRewards
  } = getTokenDetails(token, networks)

  if ((isRewards || isVesting) && !balance) return null

  return (
    <AnimatedPressable
      onPress={() => openBottomSheet()}
      style={[styles.container, animStyle]}
      {...bindAnim}
    >
      <BottomSheet
        id={`token-details-${address}`}
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
      >
        <TokenDetails
          tokenPreferences={tokenPreferences}
          token={token}
          handleClose={closeBottomSheet}
        />
      </BottomSheet>
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
          <Text
            selectable
            style={spacings.mrTy}
            fontSize={16}
            weight="number_bold"
            numberOfLines={1}
          >
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
      <Text selectable fontSize={16} weight="number_regular" style={{ flex: 0.7 }}>
        {priceUSDFormatted}
      </Text>
      <Text selectable fontSize={16} weight="number_bold" style={{ flex: 0.8, textAlign: 'right' }}>
        {balanceUSDFormatted}
      </Text>
    </AnimatedPressable>
  )
}

export default React.memo(TokenItem)
