import React from 'react'
import { View, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import LockSvg from './LockSvg'

const KeyStoreLogo = ({
  style,
  width,
  height
}: {
  style?: ViewStyle | ViewStyle[]
  width?: number
  height?: number
}) => (
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
