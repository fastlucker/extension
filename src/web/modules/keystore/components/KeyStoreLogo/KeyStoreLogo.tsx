import React from 'react'
import { View, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import LockSvg from './LockSvg'

const KeyStoreLogo = ({ style }: { style?: ViewStyle | ViewStyle[] }) => (
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
    <LockSvg />
  </View>
)

export default React.memo(KeyStoreLogo)
