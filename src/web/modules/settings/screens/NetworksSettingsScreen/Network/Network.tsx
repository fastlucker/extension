import React, { FC } from 'react'

import { Network as NetworkInterface, NetworkId } from '@ambire-common/interfaces/network'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

interface Props {
  network: NetworkInterface
  selectedNetworkId?: NetworkId
  handleSelectNetwork: (networkId: NetworkId) => void
}

const Network: FC<Props> = ({ network, selectedNetworkId, handleSelectNetwork }) => {
  const { theme } = useTheme()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: `${String(theme.secondaryBackground)}00`,
      to: theme.secondaryBackground
    },
    forceHoveredStyle: network.id === selectedNetworkId
  })

  return (
    <AnimatedPressable
      key={network.id}
      onPress={() => handleSelectNetwork(network.id)}
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        spacings.pvTy,
        spacings.phTy,
        common.borderRadiusPrimary,
        spacings.mbMi,
        animStyle
      ]}
      {...bindAnim}
    >
      <NetworkIcon id={network.id} />
      <Text fontSize={16} weight="regular" style={spacings.mlMi} numberOfLines={1}>
        {network.name}
      </Text>
    </AnimatedPressable>
  )
}

export default React.memo(Network)
