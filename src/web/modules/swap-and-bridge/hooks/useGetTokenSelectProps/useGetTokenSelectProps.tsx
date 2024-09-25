import React from 'react'

import { Network } from '@ambire-common/interfaces/network'
import { SocketAPIToken } from '@ambire-common/interfaces/swapAndBridge'
import { TokenResult } from '@ambire-common/libs/portfolio'
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

const useGetTokenSelectProps = ({
  tokens,
  token,
  networks,
  isLoading,
  skipNetwork
}: {
  tokens: SocketAPIToken[] | TokenResult[]
  token: string
  networks: Network[]
  isLoading?: boolean
  skipNetwork?: boolean
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
    options = tokens.map((t: any) => ({
      value: getTokenId(t),
      label: (
        <Text numberOfLines={1}>
          <Text fontSize={16} weight="medium">
            {t.symbol}
          </Text>
          {!skipNetwork && (
            <>
              <Text fontSize={14} appearance="secondaryText">
                {' on '}
              </Text>
              <Text fontSize={14} appearance="secondaryText">
                {networks.find((n) => n.id === t.networkId || Number(n.chainId) === t.chainId)
                  ?.name || 'Unknown network'}
              </Text>
            </>
          )}
        </Text>
      ),
      icon: t.icon ? (
        <TokenIcon containerHeight={30} containerWidth={30} uri={t.icon} withContainer />
      ) : (
        <TokenIcon
          containerHeight={30}
          containerWidth={30}
          networkSize={12}
          withContainer
          address={t.address}
          chainId={t.chainId}
          networkId={t.networkId}
        />
      )
    }))
    value = options.find((item: any) => item.value === token) || options[0]
    amountSelectDisabled = false
  }

  return {
    options,
    value,
    amountSelectDisabled
  }
}

export default useGetTokenSelectProps
