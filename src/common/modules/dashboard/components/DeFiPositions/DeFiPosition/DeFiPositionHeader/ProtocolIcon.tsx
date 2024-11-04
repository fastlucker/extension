import { FC } from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import AaveIcon from '@common/assets/svg/AaveIcon'
import UniswapIcon from '@common/assets/svg/UniswapIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

const POSITION_TO_ICON: {
  [key: string]: FC
} = {
  'Uniswap V3': UniswapIcon,
  'Uniswap V2': UniswapIcon,
  'AAVE v3': AaveIcon,
  'AAVE v2': AaveIcon,
  'AAVE v1': AaveIcon
}

const ProtocolIcon = ({
  providerName,
  networkId
}: {
  providerName: string
  networkId: Network['id']
}) => {
  const { theme } = useTheme()
  const Icon = POSITION_TO_ICON[providerName]

  return (
    <View style={spacings.mrSm}>
      <Icon />
      <NetworkIcon
        style={{
          backgroundColor: theme.primaryBackground,
          position: 'absolute',
          left: -8,
          top: -4
        }}
        scale={1}
        id={networkId}
        size={20}
      />
    </View>
  )
}
export default ProtocolIcon
