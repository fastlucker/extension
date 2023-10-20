import React from 'react'
import { Image, View } from 'react-native'
import Text from '@common/components/Text'
import shortenAddress from '@web/utils/shortenAddress'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'

const PayOption = ({ account, token }: any) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        style={{ width: 30, height: 30, borderRadius: 10, marginRight: 10 }}
        source={{
          uri:
            account.pfp || 'https://mars-images.imgix.net/nft/1629012092532.png?auto=compress&w=600'
        }}
      />
      <Text weight="medium">{shortenAddress(account.addr, 11)}</Text>
      <Text> - </Text>
      <TokenIcon
        containerHeight={30}
        containerWidth={30}
        withContainer
        address={token.address}
        networkId={token.networkId}
      />
      <Text weight="medium" style={{ marginLeft: 10 }}>
        {token.symbol}
      </Text>
    </View>
  )
}

export default PayOption
