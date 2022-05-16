import React, { useState } from 'react'
import { Image, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import logo from '@assets/images/Ambire-Wallet-logo-colored-white-vertical.png'
import AppVersion from '@modules/common/components/AppVersion'
import spacings, { IS_SCREEN_SIZE_S } from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

const AmbireLogo = ({
  shouldExpand = true,
  isResponsive = true
}: {
  shouldExpand?: boolean
  isResponsive?: boolean
}) => {
  const [tapCount, setTapCount] = useState(0)

  const handleOnLogoPress = () => setTapCount((c) => c + 1)

  return (
    <View style={[styles.logoWrapper, shouldExpand && flexboxStyles.flex1]}>
      <TouchableWithoutFeedback onPress={handleOnLogoPress}>
        <Image
          source={logo}
          style={{ height: isResponsive && IS_SCREEN_SIZE_S ? 104 : 136 }}
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
