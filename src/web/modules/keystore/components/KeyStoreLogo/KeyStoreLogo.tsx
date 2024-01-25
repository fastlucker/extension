import React from 'react'
import { View, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import LockSvg from './LockSvg'

type Props = {
  width?: number
  height?: number
  style?: ViewStyle | ViewStyle[]
}

const KeyStoreLogo = ({
  style,
  width = 90,
  height = 90
}: Props) => (
  <View
    style={[
      flexbox.alignCenter,
      flexbox.justifyCenter,
      spacings.pvLg,
      spacings.mtTy,
      spacings.mbLg,
      style
    ]}
  >
    <LockSvg width={width} height={height} />
  </View>
)

export default React.memo(KeyStoreLogo)
