import './styles.css'

import { networks } from 'ambire-common/src/consts/networks'
import { TokenResult as TokenResultInterface } from 'ambire-common/src/libs/portfolio/interfaces'
import { formatUnits } from 'ethers'
import LottieView from 'lottie-react'
import React from 'react'
import { View } from 'react-native'

import GasTankIcon from '@common/assets/svg/GasTankIcon'
import InformationIcon from '@common/assets/svg/InformationIcon/InformationIcon'
import RewardsIcon from '@common/assets/svg/RewardsIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import Button from '@common/components/Button'
import Dropdown from '@common/components/Dropdown'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

import animationWallets from './animation-wallets.json'
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
  const { navigate } = useNavigation()
  // TODO: navigate to the routes onPress once they are ready or hide the ones we wont need for epic 1
  // Logic for this ones and which token would be able to
  // Top Up Gas Tank will be available from availableGasTankAssets
  const data = [
    { label: 'Swap', value: '1' },
    { label: 'Bridge', value: '2' },
    { label: 'Top Up Gas Tank', value: '3' },
    { label: 'Deposit', value: '4' },
    { label: 'Hide', value: '5' },
    { label: 'Earn', value: '6' },
    { label: 'Withdraw', value: '7' }
  ]
  const networkData = networks.find(({ id }) => networkId === id)

  const balance = parseFloat(formatUnits(amount, decimals))
  const price =
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0
  const balanceUSD = balance * price
  const rewards = rewardsType === 'wallet-rewards'
  const vesting = rewardsType === 'wallet-vesting'

  /**
   * Explanation why we converted to html element
   *
   * Unfortunatly in the case we have Pressable (our Button component)
   * inside Pressable, like we need here in order to have hover effect on the token,
   * once we are on the Button component (aka the child Pressable) the hover on the parent disappears
   * */
  const containerStyles = {
    ...styles.container,
    ...((rewards || vesting) && styles.rewardsContainer)
  }

  if ((rewards || vesting) && !balance) return

  return (
    <div
      className={rewards || vesting ? 'rewards-token-container' : 'token-container'}
      style={containerStyles}
    >
      <View
        style={[flexboxStyles.directionRow, flexboxStyles.flex1, flexboxStyles.justifySpaceBetween]}
      >
        <View style={[flexboxStyles.directionRow]}>
          <View style={[spacings.mrTy, flexboxStyles.justifyCenter]}>
            {rewards || vesting ? (
              <View style={styles.tokenButtonIconWrapper}>
                <RewardsIcon width={20} height={20} />
              </View>
            ) : (
              <TokenIcon withContainer address={address} networkId={networkId} />
            )}
          </View>
          <View>
            <View style={[flexboxStyles.directionRow, flexboxStyles.alignSelfStart]}>
              <Text
                style={[spacings.mrTy]}
                fontSize={14}
                shouldScale={false}
                weight="semiBold"
                numberOfLines={1}
              >
                {balance.toFixed(balance < 1 ? 8 : 4)} {symbol}
              </Text>
              <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
                <Text weight="regular" shouldScale={false} fontSize={12}>
                  {rewards && t('rewards for claim')}
                  {vesting && t('claimable early supporters vesting')}
                  {!rewards && !vesting && t('on')}
                </Text>
                {onGasTank && <GasTankIcon width={18} height={18} color={theme.primary} />}
                {!onGasTank && !rewards && !vesting && (
                  <NetworkIcon name={networkId} style={{ width: 25, height: 25 }} />
                )}
                <Text weight="regular" style={[spacings.mrMi]} fontSize={12}>
                  {onGasTank && t('Gas Tank')}
                  {!onGasTank && !rewards && !vesting && networkData?.name}
                </Text>
                <InformationIcon color={theme.secondaryText} />
              </View>
            </View>
            <Text fontSize={14} weight="regular" style={textStyles.highlightPrimary}>
              ${balanceUSD?.toFixed(2)}
            </Text>
          </View>
        </View>
        {(rewards || vesting) && (
          <LottieView
            animationData={animationWallets}
            style={{
              width: 80,
              height: 40
            }}
          />
        )}
      </View>

      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <div className="button-pressable">
          {onGasTank && (
            <Button
              type="primary"
              size="small"
              style={{ width: 80 }}
              text={t('Top Up')}
              hasBottomSpacing={false}
            />
          )}

          {(rewards || vesting) && (
            <Button
              type="outline"
              size="small"
              accentColor={theme.primary}
              text={t('Claim')}
              style={{ width: 80 }}
              hasBottomSpacing={false}
            />
          )}

          {!onGasTank && !rewards && !vesting && (
            <Button
              type="outline"
              size="small"
              accentColor={theme.primary}
              onPress={() =>
                navigate(`${WEB_ROUTES.transfer}?address=${address}&networkId=${networkId}`)
              }
              style={[flexboxStyles.directionRow]}
              text={t('Send')}
              hasBottomSpacing={false}
            >
              <SendIcon width={20} height={20} color={theme.primary} />
            </Button>
          )}
        </div>
        <View>
          <Dropdown data={data} onSelect={() => null} />
        </View>
      </View>
    </div>
  )
}

export default React.memo(TokenItem)
