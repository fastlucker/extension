import React from 'react'
import { View, ViewStyle } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'

import LockSvg from './LockSvg'

type Props = {
  width?: number
  height?: number
  style?: ViewStyle | ViewStyle[]
}

const KeyStoreLogo = ({ width, height, style }: Props) => (
  <View style={[flexbox.alignCenter, flexbox.justifyCenter, style]}>
    <LockSvg width={width || 90} height={height || 90} />
  </View>
)

export default React.memo(KeyStoreLogo)
