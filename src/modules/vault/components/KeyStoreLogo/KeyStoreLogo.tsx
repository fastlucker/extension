import React from 'react'
import { View } from 'react-native'

import { isWeb } from '@config/env'
import { DEVICE_WIDTH } from '@modules/common/styles/spacings'

import LockSvg from './LockSvg'
import styles from './styles'

const scale = isWeb ? 0.7 : 0.8

const KeyStoreLogo = () => (
  <View style={styles.backgroundImgWrapper}>
    <LockSvg width={DEVICE_WIDTH * scale} height={DEVICE_WIDTH * scale} />
  </View>
)

export default KeyStoreLogo
