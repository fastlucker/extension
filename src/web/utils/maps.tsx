import React from 'react'
import { View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import networks from '@common/constants/networks'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'

const mapTokenOptions = (values: TokenResult[]) =>
  values.map((value) => ({
    value: `${value.address}-${value.networkId}`,
    label: (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TokenIcon
          containerHeight={30}
          containerWidth={30}
          withContainer
          address={value.address}
          networkId={value.networkId}
        />
        <Text weight="medium" style={{ marginLeft: 10 }}>
          {value.symbol}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
          <Text fontSize={14}>on</Text>
          <NetworkIcon name={value.networkId} />
          <Text fontSize={14}>
            {networks.find((network) => network.id === value?.networkId)?.name}
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
