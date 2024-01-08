import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { TokenResult } from '@ambire-common/libs/portfolio'
import BridgeIcon from '@common/assets/svg/BridgeIcon'
import CloseIcon from '@common/assets/svg/CloseIcon'
import DepositIcon from '@common/assets/svg/DepositIcon'
import EarnIcon from '@common/assets/svg/EarnIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import WithdrawIcon from '@common/assets/svg/WithdrawIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { BRIDGE_URL } from '@common/constants/externalDAppUrls'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import getTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings, { SPACING, SPACING_SM } from '@common/styles/spacings'
import { createTab } from '@web/extension-services/background/webapi/tab'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const actions = [
  [
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
      text: 'Bridge',
      icon: BridgeIcon,
      onPress: () => createTab(BRIDGE_URL),
      isDisabled: false
    },
    {
      text: 'Deposit',
      icon: DepositIcon,
      onPress: () => {},
      isDisabled: true
    }
  ],
  [
    {
      text: 'Earn',
      icon: EarnIcon,
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
      text: 'Withdraw',
      icon: WithdrawIcon,
      onPress: () => {},
      isDisabled: true
    },
    // Empty buttons to fill the space
    null
  ]
]
const { isTab } = getUiType()

const DetailsInner = ({
  token,
  handleClose
}: {
  token: TokenResult | null
  handleClose: () => void
}) => {
  const { theme, styles } = useTheme(getStyles)
  const { navigate } = useNavigation()
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
      {actions.map((actionRow, actionRowIndex) => (
        <View
          key={actionRow[0]?.text}
          style={[styles.buttons, { marginBottom: actionRowIndex === 0 ? SPACING : 0 }]}
        >
          {actionRow.map((button, index) => {
            // Empty buttons to fill the space
            if (button === null) {
              const buttonStyle = {
                ...styles.emptyButton,
                marginLeft: index !== 0 ? SPACING_SM : 0
              }

              return (
                <Button
                  key={`empty-button-${uuidv4()}`}
                  size={isTab ? 'regular' : 'small'}
                  type="secondary"
                  style={buttonStyle}
                  disabled
                />
              )
            }

            const { text, icon: Icon, isDisabled, onPress } = button

            const buttonStyle = {
              ...styles.button,
              marginLeft: index !== 0 ? SPACING_SM : 0
            }

            return (
              <Button
                key={button.text}
                disabled={isDisabled || balance === 0}
                onPress={() => {
                  onPress({ ...token, navigate })
                  handleClose()
                }}
                text={text}
                size={isTab ? 'regular' : 'small'}
                type="secondary"
                textStyle={spacings.mrMi}
                style={buttonStyle}
              >
                <Icon color={theme.primary} width={isTab ? 20 : 16} height={isTab ? 20 : 16} />
              </Button>
            )
          })}
        </View>
      ))}
    </View>
  )
}

export default DetailsInner
