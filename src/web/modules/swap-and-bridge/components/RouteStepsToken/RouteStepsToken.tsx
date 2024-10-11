import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'

import styles from './styles'

interface Props {
  symbol: string
  address: string
  networkId?: string
  chainId?: number
  uri?: string
  isLast?: boolean
  amount?: string
}

const RouteStepsToken: React.FC<Props> = ({
  symbol,
  address,
  networkId,
  chainId,
  uri,
  isLast = false,
  amount = ''
}) => (
  <View style={[styles.tokenWrapper, { alignItems: isLast ? 'flex-end' : 'flex-start' }]}>
    <View style={styles.tokenContainer}>
      <TokenIcon
        uri={uri}
        width={30}
        height={30}
        address={address}
        networkId={networkId || chainId}
        withNetworkIcon
      />
    </View>

    <View style={styles.textContainer}>
      <Text fontSize={14} weight="medium" style={styles.text}>
        {amount ? `${amount} ` : ''}
        {symbol}
      </Text>
    </View>
  </View>
)

export default RouteStepsToken
