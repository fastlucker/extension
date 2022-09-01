import React, { useState } from 'react'
import { Image, Platform, TouchableWithoutFeedback, View } from 'react-native'

import logo from '@assets/images/Ambire-Wallet-logo-colored-white-vertical.png'
import { isWeb } from '@config/env'
import AppVersion from '@modules/common/components/AppVersion'
import spacings, { IS_SCREEN_SIZE_S } from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

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
