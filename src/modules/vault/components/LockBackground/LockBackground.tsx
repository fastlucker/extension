import React from 'react'
import { View } from 'react-native'

import { HEADER_HEIGHT } from '@config/Router/Header/style'
import { DEVICE_WIDTH, SPACING_LG } from '@modules/common/styles/spacings'

import LockSvg from './LockSvg'
import styles from './styles'

const LockBackground = () => (
  <View style={styles.backgroundImgWrapper}>
    <LockSvg width={DEVICE_WIDTH + SPACING_LG} />
  </View>
)

export default LockBackground
