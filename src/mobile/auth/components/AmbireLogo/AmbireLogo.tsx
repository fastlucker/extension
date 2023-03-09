import React, { useState } from 'react'
import { Image, Platform, TouchableWithoutFeedback, View } from 'react-native'

import logo from '@assets/images/Ambire-Wallet-logo-colored-white-vertical.png'
import AppVersion from '@common/components/AppVersion'
import { isWeb } from '@common/config/env'
import spacings, { IS_SCREEN_SIZE_S } from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  shouldExpand?: boolean
  isResponsive?: boolean
}

const AmbireLogo = ({ shouldExpand = true, isResponsive = true }: Props) => {
  const [tapCount, setTapCount] = useState(0)

  const handleOnLogoPress = () => setTapCount((c) => c + 1)

  return (
    <View style={[styles.logoWrapper, shouldExpand && flexboxStyles.flex1]}>
      <TouchableWithoutFeedback onPress={handleOnLogoPress}>
        <Image
          source={logo}
          style={{
            height: isResponsive && IS_SCREEN_SIZE_S ? 96 : 136,
            width: 120,
            ...(isWeb ? { modalHeight: 120 } : {})
          }}
          resizeMode="contain"
        />
      </TouchableWithoutFeedback>
      {tapCount >= 7 && (
        <View style={[styles.logoWrapper, spacings.pb0]}>
          <AppVersion />
        </View>
      )}
    </View>
  )
}

export default AmbireLogo
