import React, { useEffect, useRef } from 'react'
import { Animated, Easing, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

interface Props {
  width: ViewStyle['width']
  height: ViewStyle['height']
  borderRadius?: number
  style?: ViewStyle
  lowOpacity?: boolean
}
const ANIMATION_DURATION: number = 1000

const sharedAnimationConfig = {
  duration: ANIMATION_DURATION,
  useNativeDriver: !isWeb
}
const SkeletonLoader = ({
  width,
  height,
  borderRadius = BORDER_RADIUS_PRIMARY,
  style,
  lowOpacity = false
}: Props) => {
  const pulseAnim = useRef(new Animated.Value(0)).current
  const { theme } = useTheme()

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: lowOpacity ? 0.15 : 1,
          easing: Easing.out(Easing.ease)
        }),
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: lowOpacity ? 0.05 : 0,
          easing: Easing.in(Easing.ease)
        })
      ])
    ).start()

    return () => {
      // cleanup
      pulseAnim.stopAnimation()
    }
  }, [lowOpacity, pulseAnim])

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.secondaryBackground,
          borderRadius
        },
        { opacity: pulseAnim },
        style
      ]}
    />
  )
}

export default SkeletonLoader
