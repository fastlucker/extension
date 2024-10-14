import React from 'react'

import { Network } from '@ambire-common/interfaces/network'
import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'

import { getTokenId } from './token'

const mapTokenOptions = (values: TokenResult[], networks: Network[]) =>
  values.map((value) => ({
    value: getTokenId(value),
    label: (
      <Text numberOfLines={1}>
        <Text fontSize={16} weight="medium">
          {value.symbol}
        </Text>
        <Text fontSize={14} appearance="secondaryText">
          {' on '}
        </Text>
        <Text fontSize={14} appearance="secondaryText">
          {networks.find((network) => network.id === value?.networkId)?.name || 'Unknown network'}
        </Text>
      </Text>
    ),
    icon: (
      <TokenIcon
        key={`${value.networkId}-${value.address}`}
        containerHeight={30}
        containerWidth={30}
        networkSize={12}
        withContainer
        address={value.address}
        networkId={value.networkId}
      />
    )
  }))

const getTokenAddressAndNetworkFromId = (id: string) => {
  const [address, networkId] = id.split('-')
  return [address, networkId]
}

export { mapTokenOptions, getTokenAddressAndNetworkFromId }
