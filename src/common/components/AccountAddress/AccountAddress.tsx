import React, { FC } from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useReverseLookup from '@common/hooks/useReverseLookup'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import SkeletonLoader from '../SkeletonLoader'
import PlainAddress from './PlainAddress'

interface Props extends ReturnType<typeof useReverseLookup> {
  address: string
  plainAddressMaxLength?: number
}

const AccountAddress: FC<Props> = ({ isLoading, ens, ud, address, plainAddressMaxLength = 42 }) => {
  if (isLoading) {
    return <SkeletonLoader width={200} height={20} />
  }

  return (
    <View style={{ height: 20 }} testID="address">
      {ens || ud ? (
        <View style={[flexbox.directionRow, flexbox.alignCenter]}>
          <Text fontSize={12} weight="semiBold" appearance="primary">
            {ens || ud}
          </Text>
          <PlainAddress maxLength={18} address={address} style={spacings.mlMi} />
        </View>
      ) : (
        <PlainAddress maxLength={plainAddressMaxLength} address={address} hideParentheses />
      )}
    </View>
  )
}

export default AccountAddress
