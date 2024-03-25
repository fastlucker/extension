import React, { FC } from 'react'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

interface Props {
  network: NetworkDescriptor
  selectedNetworkId?: NetworkDescriptor['id']
  handleSelectNetwork: (networkId: NetworkDescriptor['id']) => void
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
      <NetworkIcon name={network.id as NetworkIconNameType} />
      <Text fontSize={16} weight="regular" style={spacings.mlMi} numberOfLines={1}>
        {network.name}
      </Text>
    </AnimatedPressable>
  )
}

export default React.memo(Network)
