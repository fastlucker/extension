import React from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { SocketAPIToken } from '@ambire-common/interfaces/swapAndBridge'
import { TokenResult } from '@ambire-common/libs/portfolio'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { getTokenId } from '@web/utils/token'

const NO_TOKENS_ITEMS = [
  {
    value: 'noTokens',
    label: (
      <Text weight="medium" fontSize={14}>
        You don&apos;t have any tokens
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
  isLoading,
  isToToken = false
}: {
  tokens: SocketAPIToken[] | TokenResult[]
  token: string
  networks: Network[]
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
    value = NO_TOKENS_ITEMS[0]
    options = NO_TOKENS_ITEMS
  } else {
    options = tokens.map((t: SocketAPIToken | TokenResult) => {
      const symbol = isToToken
        ? // Overprotective on purpose here, the API does return `null` values, although it shouldn't
          (t as SocketAPIToken).symbol?.trim() || 'No symbol'
        : t.symbol
      const name = isToToken
        ? // Overprotective on purpose here, the API does return `null` values, although it shouldn't
          (t as SocketAPIToken).name?.trim() || 'No name'
        : ''

      const label = isToToken ? (
        <View>
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
      ) : (
        <Text>
          <Text fontSize={16} weight="medium">
            {symbol}
          </Text>
          <Text fontSize={14} appearance="secondaryText">
            {' on '}
          </Text>
          <Text fontSize={14} appearance="secondaryText">
            {networks.find((n) => n.id === (t as TokenResult).networkId)?.name || 'Unknown network'}
          </Text>
        </Text>
      )

      const networkIdOrChainId = isToToken
        ? (t as SocketAPIToken).chainId
        : (t as TokenResult).networkId

      return {
        value: getTokenId(t),
        extraSearchProps: { symbol, name, address: t.address },
        label,
        icon: (
          <TokenIcon
            key={`${networkIdOrChainId}-${t.address}`}
            containerHeight={30}
            containerWidth={30}
            networkSize={12}
            withContainer
            withNetworkIcon={!isToToken}
            uri={isToToken ? (t as SocketAPIToken).icon : undefined}
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
