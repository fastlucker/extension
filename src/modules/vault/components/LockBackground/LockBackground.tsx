import React from 'react'
import { View } from 'react-native'

import { DEVICE_WIDTH, SPACING_LG } from '@modules/common/styles/spacings'

import LockSvg from './LockSvg'
import styles from './styles'

const LockBackground = () => (
  <View style={styles.backgroundImgWrapper}>
    <LockSvg style={styles.backgroundImg} width={DEVICE_WIDTH + SPACING_LG} />
  </View>
)

export default LockBackground
