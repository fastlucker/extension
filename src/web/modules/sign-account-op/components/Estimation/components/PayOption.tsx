import React from 'react'
import { Image, View } from 'react-native'

import Text from '@common/components/Text'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import shortenAddress from '@web/utils/shortenAddress'

const PayOption = ({ account, token }: any) => {
  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      <Image
        style={[{ width: 32, height: 32, ...spacings.mrTy, ...common.borderRadiusPrimary } as any]}
        source={{
          uri:
            account.pfp || 'https://mars-images.imgix.net/nft/1629012092532.png?auto=compress&w=600'
        }}
      />
      <Text weight="medium">{shortenAddress(account.addr, 11)}</Text>
      <Text> - </Text>
      <TokenIcon
        containerHeight={32}
        containerWidth={32}
        withContainer
        address={token.address}
        networkId={token.networkId}
      />
      <Text weight="medium" style={spacings.mlTy}>
        {token.symbol}
      </Text>
    </View>
  )
}

export default PayOption
