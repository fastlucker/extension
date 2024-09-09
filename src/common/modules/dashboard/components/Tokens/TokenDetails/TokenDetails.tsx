import { getAddress, ZeroAddress } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { geckoIdMapper } from '@ambire-common/consts/coingecko'
import { isSmartAccount as getIsSmartAccount } from '@ambire-common/libs/account/account'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import BridgeIcon from '@common/assets/svg/BridgeIcon'
import DepositIcon from '@common/assets/svg/DepositIcon'
import EarnIcon from '@common/assets/svg/EarnIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import WithdrawIcon from '@common/assets/svg/WithdrawIcon'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import TokenIcon from '@common/components/TokenIcon'
import { BRIDGE_URL } from '@common/constants/externalDAppUrls'
import useConnectivity from '@common/hooks/useConnectivity'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import getTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { RELAYER_URL } from '@env'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

import TokenDetailsButton from './Button'
import CopyTokenAddress from './CopyTokenAddress'
import getStyles from './styles'

const TokenDetails = ({
  token,
  handleClose,
  tokenPreferences
}: {
  token: TokenResult | null
  handleClose: () => void
  tokenPreferences: CustomToken[]
}) => {
  const { styles } = useTheme(getStyles)
  const { navigate } = useNavigation()
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { isOffline } = useConnectivity()
  const { selectedAccount, accounts } = useAccountsControllerState()
  const { dispatch } = useBackgroundService()
  const { networks } = useNetworksControllerState()
  const [hasTokenInfo, setHasTokenInfo] = useState(false)
  const [isTokenInfoLoading, setIsTokenInfoLoading] = useState(false)
  const [isHidden, setIsHidden] = useState(!!token?.isHidden)

  // if the token is a gas tank token, all actions except
  // top up and maybe token info should be disabled
  const isGasTankOrRewardsToken = token?.flags.onGasTank || !!token?.flags.rewardsType
  const isAmountZero = token && getTokenAmount(token) === 0n
  const canToToppedUp = token?.flags.canTopUpGasTank
  const selectedAccountData = accounts.find((acc) => acc.addr === selectedAccount)
  const isSmartAccount = selectedAccountData ? getIsSmartAccount(selectedAccountData) : false

  const actions = useMemo(
    () => [
      {
        id: 'send',
        text: t('Send'),
        icon: SendIcon,
        onPress: ({ networkId, address }: TokenResult) =>
          navigate(`transfer?networkId=${networkId}&address=${address}`),
        isDisabled: isGasTankOrRewardsToken || isAmountZero,
        strokeWidth: 1.5,
        testID: 'token-send'
      },
      {
        id: 'swap',
        text: t('Swap'),
        icon: SwapIcon,
        onPress: async ({ networkId, address }: TokenResult) => {
          const networkData = networks.find((n) => n.id === networkId)

          if (!networkData) {
            addToast(t('Network not found'), { type: 'error' })
            return
          }

          let inputCurrency = address

          if (address === ZeroAddress) {
            // Uniswap doesn't select the native token if you pass its address
            inputCurrency = 'native'
          }

          // Change the current dapp network to the selected one,
          // otherwise uniswap will select the token from the current network
          dispatch({
            type: 'CHANGE_CURRENT_DAPP_NETWORK',
            params: {
              chainId: Number(networkData.chainId),
              origin: 'https://app.uniswap.org'
            }
          })

          await createTab(`https://app.uniswap.org/swap?inputCurrency=${inputCurrency}`)
        },
        isDisabled: isGasTankOrRewardsToken,
        strokeWidth: 1.5
      },
      {
        id: 'deposit',
        text: t('Deposit'),
        icon: DepositIcon,
        onPress: () => {},
        isDisabled: true,
        strokeWidth: 1
      },
      {
        id: 'top-up',
        text: canToToppedUp ? t('Top Up Gas Tank') : t('Top Up'),
        icon: TopUpIcon,
        onPress: async ({ networkId, address }: TokenResult) => {
          const assets: { network: string; address: string }[] = await fetch(
            `${RELAYER_URL}/gas-tank/assets`
          )
            .then((r) => r.json())
            .catch(() => addToast(t('Error while fetching from relayer'), { type: 'error' }))
          const canTopUp = !!assets.find(
            (a) => getAddress(a.address) === getAddress(address) && a.network === networkId
          )
          if (canTopUp) navigate(`transfer?networkId=${networkId}&address=${address}&isTopUp`)
          else addToast('We have disabled top ups with this token.', { type: 'error' })
        },
        isDisabled: !canToToppedUp || !isSmartAccount,
        strokeWidth: 1,
        testID: 'top-up-button'
      },
      {
        id: 'earn',
        text: t('Earn'),
        icon: EarnIcon,
        onPress: () => {},
        isDisabled: true,
        strokeWidth: 1
      },
      {
        id: 'bridge',
        text: t('Bridge'),
        icon: BridgeIcon,
        onPress: async ({ networkId, address }) => {
          const networkData = networks.find((network) => network.id === networkId)

          if (networkData) {
            let formattedAddress = address

            if (address === ZeroAddress) {
              // Bungee expects the native address to be formatted as 0xeee...eee
              formattedAddress = `0x${'e'.repeat(40)}`
            }

            await createTab(
              `${BRIDGE_URL}?fromChainId=${networkData?.chainId}&fromTokenAddress=${formattedAddress}`
            )
          }
        },
        isDisabled: isGasTankOrRewardsToken,
        strokeWidth: 1.5
      },
      {
        id: 'withdraw',
        text: t('Withdraw'),
        icon: WithdrawIcon,
        onPress: () => {},
        isDisabled: true,
        strokeWidth: 1
      },
      {
        id: 'info',
        text: t('Token Info'),
        icon: InfoIcon,
        onPress: async () => {
          if (!hasTokenInfo || !token || !networks.length) return

          const networkData = networks.find((n) => n.id === token?.networkId)
          if (!networkData) {
            addToast(t('Network not found'), { type: 'error' })
            return
          }

          const coingeckoId = geckoIdMapper(token?.address, networkData)

          try {
            await createTab(`https://www.coingecko.com/en/coins/${coingeckoId || token?.address}`)
            handleClose()
          } catch {
            addToast(t('Could not open token info'), { type: 'error' })
          }
        },
        isDisabled: !hasTokenInfo
      }
    ],
    [
      t,
      isGasTankOrRewardsToken,
      isAmountZero,
      canToToppedUp,
      hasTokenInfo,
      navigate,
      networks,
      dispatch,
      addToast,
      token,
      handleClose
    ]
  )
  useEffect(() => {
    if (!token?.address || !token?.networkId || !networks.length || isOffline) return

    setIsTokenInfoLoading(true)

    const networkData = networks.find((n) => n.id === token?.networkId)
    if (!networkData) {
      addToast(t('Network not found'), { type: 'error' })
      setIsTokenInfoLoading(false)
      return
    }
    const coingeckoId = geckoIdMapper(token?.address, networkData)

    const tokenInfoUrl = `https://www.coingecko.com/en/coins/${coingeckoId || token?.address}`

    fetch(tokenInfoUrl, {
      method: 'HEAD'
    })
      .then((result) => {
        if (result.ok) {
          setHasTokenInfo(true)
          return
        }

        setHasTokenInfo(false)
      })
      .catch(() => {
        addToast(t('Token info not found'), { type: 'error' })
      })
      .finally(() => {
        setIsTokenInfoLoading(false)
      })
  }, [t, token?.address, token?.networkId, networks, addToast])

  const handleHideToken = () => {
    if (!token) return
    setIsHidden((prev) => !prev)
    const tokenInPreferences = tokenPreferences?.length
      ? tokenPreferences.find(
          (_token) =>
            token.address.toLowerCase() === _token.address.toLowerCase() &&
            token.networkId === _token.networkId
        )
      : null

    const newToken = {
      symbol: token.symbol,
      decimals: token.decimals,
      address: token.address,
      networkId: token.networkId,
      isHidden: !token.isHidden,
      standard: tokenInPreferences?.standard || 'ERC20'
    }

    dispatch({
      type: 'PORTFOLIO_CONTROLLER_UPDATE_TOKEN_PREFERENCES',
      params: {
        token: newToken
      }
    })
  }
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
  } = getTokenDetails(token, networks)

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
                <Text selectable fontSize={20} weight="semiBold" style={spacings.mrSm}>
                  {symbol}
                </Text>
                <Text fontSize={16}>{isRewards && t('Claimable rewards')}</Text>
                <Text fontSize={16}>{isVesting && t('Claimable early supporters vesting')}</Text>
                <Text fontSize={16}>{!isRewards && !isVesting && t('on ')}</Text>
                <Text fontSize={16}>{onGasTank && t('Gas Tank')}</Text>
                <Text fontSize={16}>
                  {!onGasTank && !isRewards && !isVesting && networkData?.name}
                </Text>{' '}
                <CopyTokenAddress address={address} isRewards={isRewards} isVesting={isVesting} />
              </Text>
            </View>
            {!onGasTank && !isRewards && !isVesting && (
              <View style={[flexbox.alignSelfEnd]}>
                <Toggle
                  isOn={isHidden}
                  onToggle={handleHideToken}
                  label={isHidden ? t('Show Token') : t('Hide Token')}
                  toggleStyle={spacings.mrTy}
                />
              </View>
            )}
          </View>
          <View style={styles.balance}>
            <Text
              selectable
              style={spacings.mrMi}
              fontSize={16}
              weight="number_bold"
              numberOfLines={1}
            >
              {balanceFormatted} {symbol}
            </Text>
            <Text
              selectable
              style={spacings.mrMi}
              fontSize={16}
              weight="number_bold"
              appearance="infoText"
            >
              ≈ {balanceUSDFormatted}
            </Text>
            <Text selectable fontSize={16} weight="number_regular" appearance="secondaryText">
              (1 ${symbol} ≈ {priceUSDFormatted})
            </Text>
          </View>
          {!!onGasTank && (
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
        {actions.map((action) => (
          <TokenDetailsButton
            key={action.id}
            {...action}
            isDisabled={!!action.isDisabled}
            token={token}
            isTokenInfoLoading={isTokenInfoLoading}
            handleClose={handleClose}
          />
        ))}
      </View>
    </View>
  )
}

export default React.memo(TokenDetails)
