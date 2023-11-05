import React from 'react'
import { View, ViewStyle } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'

import LockSvg from './LockSvg'

const KeyStoreLogo = ({ style }: { style?: ViewStyle | ViewStyle[] }) => (
  <View style={[flexbox.alignCenter, flexbox.justifyCenter, style]}>
    <LockSvg />
  </View>
)

export default React.memo(KeyStoreLogo)
