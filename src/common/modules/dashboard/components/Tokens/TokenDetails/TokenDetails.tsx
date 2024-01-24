import * as Clipboard from 'expo-clipboard'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TouchableOpacity, View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import BridgeIcon from '@common/assets/svg/BridgeIcon'
import DepositIcon from '@common/assets/svg/DepositIcon'
import EarnIcon from '@common/assets/svg/EarnIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import WithdrawIcon from '@common/assets/svg/WithdrawIcon'
import Text from '@common/components/Text'
import { BRIDGE_URL } from '@common/constants/externalDAppUrls'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import getTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import CopyIcon from '@web/assets/svg/CopyIcon'
import { createTab } from '@web/extension-services/background/webapi/tab'
import shortenAddress from '@web/utils/shortenAddress'

import getStyles from './styles'

const TokenDetails = ({
  token,
  handleClose
}: {
  token: TokenResult | null
  handleClose: () => void
}) => {
  const { theme, styles } = useTheme(getStyles)
  const { navigate } = useNavigation()
  const { addToast } = useToast()
  const { t } = useTranslation()

  // if the token is a gas tank token, all actions except
  // top up and maybe token info should be disabled
  const isGasTank = token?.flags.onGasTank
  const actions = useMemo(
    () => [
      {
        text: t('Send'),
        icon: SendIcon,
        onPress: ({ networkId, address }: TokenResult) =>
          navigate(`transfer?networkId=${networkId}&address=${address}`),
        isDisabled: isGasTank
      },
      {
        text: t('Swap'),
        icon: SwapIcon,
        onPress: ({ networkId, address }: TokenResult) =>
          createTab(`https://app.uniswap.org/tokens/${networkId}/${address}`),
        isDisabled: isGasTank
      },
      {
        text: t('Deposit'),
        icon: DepositIcon,
        onPress: () => {},
        isDisabled: true
      },
      {
        text: t('Top Up'),
        icon: TopUpIcon,
        onPress: () => {},
        isDisabled: true
      },
      {
        text: t('Earn'),
        icon: EarnIcon,
        onPress: () => {},
        isDisabled: true
      },
      {
        text: t('Bridge'),
        icon: BridgeIcon,
        onPress: () => createTab(BRIDGE_URL),
        isDisabled: isGasTank
      },
      {
        text: t('Withdraw'),
        icon: WithdrawIcon,
        onPress: () => {},
        isDisabled: true
      },
      {
        text: t('Token Info'),
        icon: InfoIcon,
        onPress: () => {},
        isDisabled: true
      }
    ],
    [navigate, t, isGasTank]
  )

  if (!token) return null

  const {
    flags: { onGasTank },
    networkId,
    symbol,
    address
  } = token

  const {
    balanceFormatted,
    priceUSDFormatted,
    balanceUSDFormatted,
    isRewards,
    isVesting,
    networkData
  } = getTokenDetails(token)

  return (
    <View>
      <View style={styles.tokenInfoAndIcon}>
        <TokenIcon
          containerHeight={48}
          containerWidth={48}
          width={36}
          height={36}
          networkSize={16}
          withContainer
          address={address}
          onGasTank={onGasTank}
          networkId={networkId}
        />
        <View style={styles.tokenInfo}>
          <View style={styles.tokenSymbolAndNetwork}>
            <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
              <Text>
                <Text fontSize={20} weight="semiBold" style={spacings.mrSm}>
                  {symbol}
                </Text>
                <Text fontSize={16}>{isRewards && t('rewards for claim')}</Text>
                <Text fontSize={16}>{isVesting && t('claimable early supporters vesting')}</Text>
                <Text fontSize={16}>{!isRewards && !isVesting && t('on')}</Text>
                <Text fontSize={16}>{onGasTank && t(' Gas Tank')}</Text>
                <Text fontSize={16}>
                  {!onGasTank && !isRewards && !isVesting && networkData?.name}
                </Text>{' '}
                <Text fontSize={16} weight="number_regular" appearance="secondaryText">
                  ({shortenAddress(address, isRewards || isVesting ? 10 : 22)})
                </Text>
                <TouchableOpacity
                  style={spacings.mlMi}
                  onPress={() => {
                    Clipboard.setStringAsync(address).catch(() => null)
                    addToast(t('Address copied to clipboard!') as string, { timeout: 2500 })
                  }}
                >
                  <CopyIcon width={16} height={16} color={iconColors.secondary} strokeWidth="1.5" />
                </TouchableOpacity>
              </Text>
            </View>
          </View>
          <View style={styles.balance}>
            <Text style={spacings.mrMi} fontSize={16} weight="number_bold" numberOfLines={1}>
              {balanceFormatted} {symbol}
            </Text>
            <Text style={spacings.mrMi} fontSize={16} weight="number_bold" appearance="infoText">
              ≈ ${balanceUSDFormatted}
            </Text>
            <Text fontSize={16} weight="number_regular" appearance="secondaryText">
              (1 ${symbol} ≈ ${priceUSDFormatted})
            </Text>
          </View>
          {onGasTank && (
            <View style={styles.balance}>
              <Text
                style={spacings.mtMi}
                color={iconColors.danger}
                fontSize={12}
                weight="number_regular"
                numberOfLines={1}
              >
                (This token is a gas tank one and therefore actions are limited)
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.actionsContainer}>
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Pressable
              key={action.text}
              style={({ hovered }: any) => [
                styles.action,
                action.isDisabled && { opacity: 0.4 },
                hovered && { backgroundColor: theme.secondaryBackground }
              ]}
              disabled={action.isDisabled}
              onPress={() => {
                action.onPress(token)
                handleClose()
              }}
            >
              <View style={spacings.mbMi}>
                <Icon color={theme.primary} width={32} height={32} strokeWidth="1" />
              </View>
              <Text fontSize={14} weight="medium" style={text.center}>
                {action.text}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

export default React.memo(TokenDetails)
