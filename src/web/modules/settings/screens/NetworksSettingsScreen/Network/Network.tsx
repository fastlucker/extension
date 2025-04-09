import React, { FC } from 'react'

import { Network as NetworkInterface } from '@ambire-common/interfaces/network'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

interface Props {
  network: NetworkInterface
  selectedChainId?: bigint
  handleSelectNetwork: (chainId: bigint) => void
}

const Network: FC<Props> = ({ network, selectedChainId, handleSelectNetwork }) => {
  const { theme } = useTheme()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: `${String(theme.secondaryBackground)}00`,
      to: theme.secondaryBackground
    },
    forceHoveredStyle: network.chainId === selectedChainId
  })

  return (
    <AnimatedPressable
      key={network.chainId.toString()}
      onPress={() => handleSelectNetwork(network.chainId)}
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
      <NetworkIcon id={network.chainId.toString()} />
      <Text fontSize={16} weight="regular" style={spacings.mlMi} numberOfLines={1}>
        {network.name}
      </Text>
    </AnimatedPressable>
  )
}

export default React.memo(Network)
