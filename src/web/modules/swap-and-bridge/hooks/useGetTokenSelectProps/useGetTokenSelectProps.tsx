import React from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { SwapAndBridgeToToken } from '@ambire-common/interfaces/swapAndBridge'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { getAndFormatTokenDetails } from '@ambire-common/libs/portfolio/helpers'
import { getIsNetworkSupported } from '@ambire-common/libs/swapAndBridge/swapAndBridge'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import flexbox from '@common/styles/utils/flexbox'
import NotSupportedNetworkTooltip from '@web/modules/swap-and-bridge/components/NotSupportedNetworkTooltip'
import { getTokenId } from '@web/utils/token'

const getTokenOptionsEmptyState = (isToToken = false) => [
  {
    value: 'noTokens',
    label: (
      <Text weight="medium" fontSize={14}>
        {isToToken ? 'Failed to retrieve tokens' : "You don't have any tokens"}
      </Text>
    ),
    icon: null
  }
]

const LOADING_TOKEN_ITEMS = [
  {
    value: 'loading',
    label: (
      <Text weight="medium" fontSize={14}>
        Fetching tokens...
      </Text>
    ),
    icon: null
  }
]

const NO_VALUE_SELECTED = [
  {
    value: 'no-selection',
    label: (
      <Text weight="medium" fontSize={14}>
        Please select token
      </Text>
    ),
    icon: null
  }
]

const useGetTokenSelectProps = ({
  tokens,
  token,
  networks,
  supportedChainIds,
  isLoading,
  isToToken = false
}: {
  tokens: SwapAndBridgeToToken[] | TokenResult[]
  token: string
  networks: Network[]
  supportedChainIds: Network['chainId'][]
  isLoading?: boolean
  isToToken?: boolean
}) => {
  let options: any = []
  let value = null
  let amountSelectDisabled = true

  if (isLoading) {
    value = LOADING_TOKEN_ITEMS[0]
    options = LOADING_TOKEN_ITEMS
  } else if (tokens?.length === 0) {
    const noTokensEmptyState = getTokenOptionsEmptyState(isToToken)
    value = noTokensEmptyState[0]
    options = noTokensEmptyState
  } else {
    options = tokens.map((t: SwapAndBridgeToToken | TokenResult) => {
      const symbol = isToToken
        ? // Overprotective on purpose here, the API does return `null` values, although it shouldn't
          (t as SwapAndBridgeToToken).symbol?.trim() || 'No symbol'
        : t.symbol
      const name = isToToken
        ? // Overprotective on purpose here, the API does return `null` values, although it shouldn't
          (t as SwapAndBridgeToToken).name?.trim() || 'No name'
        : ''
      const network = networks.find((n) =>
        isToToken
          ? Number(n.chainId) === (t as SwapAndBridgeToToken).chainId
          : n.id === (t as TokenResult).networkId
      )
      const tooltipId = `token-${t.address}-on-network-${network?.chainId}-not-supported-tooltip`
      const isTokenNetworkSupported = getIsNetworkSupported(supportedChainIds, network)
      const isInAccPortfolio = isToToken ? (t as SwapAndBridgeToToken).isInAccPortfolio : true
      const balanceUSDFormatted = isToToken
        ? (t as SwapAndBridgeToToken).formattedTokenDetails?.balanceUSDFormatted
        : getAndFormatTokenDetails(t as TokenResult, networks)?.balanceUSDFormatted

      const label = isToToken ? (
        <>
          <View dataSet={{ tooltipId }} style={flexbox.flex1}>
            <Text numberOfLines={1}>
              <Text fontSize={16} weight="medium">
                {symbol}
              </Text>
              <Text fontSize={12} appearance="secondaryText">
                {' '}
                ({shortenAddress(t.address, 13)})
              </Text>
            </Text>
            <Text numberOfLines={1} fontSize={12}>
              {name}
            </Text>
          </View>
          {!!balanceUSDFormatted && (
            <Text fontSize={14} appearance="secondaryText">
              {balanceUSDFormatted}
            </Text>
          )}
          {!isTokenNetworkSupported && (
            <NotSupportedNetworkTooltip tooltipId={tooltipId} network={network} />
          )}
        </>
      ) : (
        <>
          <Text numberOfLines={1} dataSet={{ tooltipId }} style={flexbox.flex1}>
            <Text fontSize={16} weight="medium">
              {symbol}
            </Text>
            <Text fontSize={14} appearance="secondaryText">
              {' on '}
            </Text>
            <Text fontSize={14} appearance="secondaryText">
              {network?.name || 'Unknown network'}
            </Text>
          </Text>
          {!!balanceUSDFormatted && (
            <Text fontSize={14} appearance="secondaryText">
              {balanceUSDFormatted}
            </Text>
          )}
          {!isTokenNetworkSupported && (
            <NotSupportedNetworkTooltip tooltipId={tooltipId} network={network} />
          )}
        </>
      )

      const networkIdOrChainId = isToToken
        ? (t as SwapAndBridgeToToken).chainId
        : (t as TokenResult).networkId

      return {
        value: getTokenId(t),
        disabled: !isTokenNetworkSupported,
        extraSearchProps: { symbol, name, address: t.address },
        isInAccPortfolio,
        label,
        icon: (
          <TokenIcon
            key={`${networkIdOrChainId}-${t.address}`}
            containerHeight={30}
            containerWidth={30}
            networkSize={12}
            withContainer
            withNetworkIcon={!isToToken}
            uri={isToToken ? (t as SwapAndBridgeToToken).icon : undefined}
            address={t.address}
            networkId={networkIdOrChainId}
          />
        )
      }
    })

    if (!token) {
      value = NO_VALUE_SELECTED[0]
    } else {
      value = options.find((item: any) => item.value === token) || options[0]
    }
    amountSelectDisabled = false
  }

  return {
    options,
    value,
    amountSelectDisabled
  }
}

export default useGetTokenSelectProps
