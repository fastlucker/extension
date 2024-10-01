import React from 'react'
import { Animated, Pressable, View } from 'react-native'

import SwapBridgeToggleIcon from '@common/assets/svg/SwapBridgeToggleIcon'
import useTheme from '@common/hooks/useTheme'
import { useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

const SwitchTokensButton = () => {
  const { styles } = useTheme(getStyles)
  const [bindAnim, , , , animatedValues] = useCustomHover({
    property: 'rotateZ' as any,
    values: { from: 0, to: 1 },
    duration: 250
  })

  const rotateInterpolate = animatedValues
    ? animatedValues[0].value.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
      })
    : null

  return (
    <View style={styles.switchTokensButtonWrapper}>
      <Pressable style={styles.switchTokensButton} {...bindAnim}>
        <Animated.View style={{ transform: [{ rotateZ: rotateInterpolate || '0deg' }] }}>
          <SwapBridgeToggleIcon />
        </Animated.View>
      </Pressable>
    </View>
  )
}

export default React.memo(SwitchTokensButton)
