import React, { FC, memo, useCallback, useMemo } from 'react'
import { Linking, Pressable, View } from 'react-native'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
import { Network } from '@ambire-common/interfaces/network'
import InfoIcon from '@common/assets/svg/InfoIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

interface Props {
  chainId: bigint
  network?: Network
  marginRight?: number
}

const ChainVisualization: FC<Props> = ({ chainId, network, marginRight }) => {
  const { networks = constantNetworks } = useNetworksControllerState()
  const handleLink = useCallback(
    () => Linking.openURL(`https://chainlist.org/chain/${chainId}`),
    [chainId]
  )

  const destinationNetwork = useMemo(() => {
    if (network?.chainId === chainId) return network

    return networks.find((n) => n.chainId === chainId)
  }, [chainId, network, networks])

  return (
    <View style={{ ...flexbox.directionRow, ...flexbox.alignCenter, marginRight }}>
      {destinationNetwork ? (
        <>
          <NetworkIcon id={destinationNetwork.id} benzinNetwork={network} />
          <Text onPress={handleLink} weight="semiBold">
            {destinationNetwork.name}
          </Text>
        </>
      ) : (
        <Text onPress={handleLink} weight="semiBold">
          {`Chain with id ${chainId}`}
        </Text>
      )}
      <Pressable style={spacings.mlMi} onPress={handleLink}>
        <InfoIcon width={14} height={14} />
      </Pressable>
    </View>
  )
}

export default memo(ChainVisualization)
