import React from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import Text from '@common/components/Text'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'

const mapTokenOptions = (values: TokenResult[], networks: NetworkDescriptor[]) =>
  values.map((value) => ({
    value: `${value.address}-${value.networkId}-${value.symbol}`,
    label: (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TokenIcon
          containerHeight={30}
          containerWidth={30}
          networkSize={12}
          withContainer
          address={value.address}
          networkId={value.networkId}
        />
        <Text weight="medium" style={{ marginLeft: 10 }}>
          {value.symbol}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
          <Text fontSize={14}>
            on{' '}
            {networks.find((network) => network.id === value?.networkId)?.name || 'Unknown network'}
          </Text>
        </View>
      </View>
    ),
    icon: null
  }))

const getTokenAddressAndNetworkFromId = (id: string) => {
  const [address, networkId] = id.split('-')
  return [address, networkId]
}

export { mapTokenOptions, getTokenAddressAndNetworkFromId }
