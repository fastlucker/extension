import * as Clipboard from 'expo-clipboard'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TouchableOpacity, View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import BridgeIcon from '@common/assets/svg/BridgeIcon'
import CloseIcon from '@common/assets/svg/CloseIcon'
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
import text from '@common/styles/utils/text'
import CopyIcon from '@web/assets/svg/CopyIcon'
import { createTab } from '@web/extension-services/background/webapi/tab'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const actions = [
  {
    text: 'Send',
    icon: SendIcon,
    onPress: ({
      networkId,
      address,
      navigate
    }: TokenResult & { navigate: (url: string) => void }) =>
      navigate(`transfer?networkId=${networkId}&address=${address}`),
    isDisabled: false
  },
  {
    text: 'Swap',
    icon: SwapIcon,
    onPress: ({ networkId, address }: TokenResult) =>
      createTab(`https://app.uniswap.org/tokens/${networkId}/${address}`),
    isDisabled: false
  },
  {
    text: 'Deposit',
    icon: DepositIcon,
    onPress: () => {},
    isDisabled: true
  },
  {
    text: 'Top Up',
    icon: TopUpIcon,
    onPress: () => {},
    isDisabled: true
  },
  {
    text: 'Earn',
    icon: EarnIcon,
    onPress: () => {},
    isDisabled: true
  },
  {
    text: 'Bridge',
    icon: BridgeIcon,
    onPress: () => createTab(BRIDGE_URL),
    isDisabled: false
  },
  {
    text: 'Withdraw',
    icon: WithdrawIcon,
    onPress: () => {},
    isDisabled: true
  },
  {
    text: 'Token Info',
    icon: InfoIcon,
    onPress: () => {},
    isDisabled: true
  }
]
const { isTab } = getUiType()

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

  if (!token) return null

  const {
    flags: { onGasTank },
    networkId,
    symbol,
    address
  } = token

  const {
    balance,
    balanceFormatted,
    priceUSDFormatted,
    balanceUSDFormatted,
    isRewards,
    isVesting,
    networkData
  } = getTokenDetails(token)

  return (
    <View>
      <Pressable onPress={handleClose} style={styles.closeIcon}>
        <CloseIcon width={isTab ? 16 : 12} height={isTab ? 16 : 12} color={theme.primaryText} />
      </Pressable>
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
            <Text fontSize={20} weight="semiBold">
              {symbol}
            </Text>
            <View style={styles.network}>
              <Text weight="regular" shouldScale={false} fontSize={16}>
                {isRewards && t('rewards for claim')}
                {isVesting && t('claimable early supporters vesting')}
                {!isRewards && !isVesting && t('on')}{' '}
              </Text>
              <Text weight="regular" style={spacings.mrMi} fontSize={16}>
                {onGasTank && t('Gas Tank')}
                {!onGasTank && !isRewards && !isVesting && networkData?.name}
              </Text>
              <Text fontSize={16} style={spacings.mrMi}>
                ({shortenAddress(address, 20)})
              </Text>
              <TouchableOpacity
                style={spacings.mrTy}
                onPress={() => {
                  Clipboard.setStringAsync(address)
                  addToast(t('Address copied to clipboard!') as string, { timeout: 2500 })
                }}
              >
                <CopyIcon width={16} height={16} />
              </TouchableOpacity>
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
                action.onPress({ ...token, navigate })
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

export default TokenDetails
