import React from 'react'
import { Image, View } from 'react-native'

import logo from '@assets/images/Ambire-Wallet-logo-colored-white-vertical.png'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

const AmbireLogo = ({ shouldExpand = true }: { shouldExpand?: boolean }) => {
  return (
    <View style={[styles.logoWrapper, shouldExpand && flexboxStyles.flex1]}>
      <Image source={logo} />
    </View>
  )
}

export default AmbireLogo
