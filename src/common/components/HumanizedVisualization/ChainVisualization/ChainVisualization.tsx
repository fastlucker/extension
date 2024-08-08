import React, { FC, memo, useCallback, useMemo } from 'react'
import { Linking, Pressable, View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import InfoIcon from '@common/assets/svg/InfoIcon'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Props {
  networks: Network[]
  chainId: bigint
  marginRight?: number
}

const ChainVisualization: FC<Props> = ({ chainId, networks, marginRight }) => {
  const handleLink = useCallback(
    () => Linking.openURL(`https://chainlist.org/chain/${chainId}`),
    [chainId]
  )
  const foundChain = useMemo(() => networks.find((n) => n.chainId === chainId), [networks, chainId])

  return (
    <View style={{ ...flexbox.directionRow, ...flexbox.alignCenter, marginRight }}>
      {foundChain ? (
        <>
          <NetworkIcon id={foundChain.id} benzinNetwork={foundChain} />
          <Text onPress={handleLink} weight="semiBold">
            {foundChain.name}
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
