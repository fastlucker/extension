import React from 'react'
import { View } from 'react-native'

import { isWeb } from '@common/config/env'
import { DEVICE_WIDTH } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import LockSvg from './LogoSvg'

const size = isWeb ? 250 : DEVICE_WIDTH * 0.7

const KeyStoreLogo = () => (
  <View style={flexbox.alignCenter}>
    <LockSvg width={size} height={size} />
  </View>
)

export default KeyStoreLogo
