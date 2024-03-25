import React, { useEffect, useRef } from 'react'
import { Animated, Easing, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'

interface Props {
  width: number
  height: number
  style?: ViewStyle
}

const SkeletonLoader = ({ width, height, style }: Props) => {
  const pulseAnim = useRef(new Animated.Value(0)).current
  const { theme } = useTheme()

  useEffect(() => {
    const sharedAnimationConfig = {
      duration: 1000,
      useNativeDriver: !isWeb
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 1,
          easing: Easing.out(Easing.ease)
        }),
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 0,
          easing: Easing.in(Easing.ease)
        })
      ])
    ).start()

    return () => {
      // cleanup
      pulseAnim.stopAnimation()
    }
  }, [])

  const opacityAnim = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.15]
  })

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.secondaryBackground,
          borderRadius: 8
        },
        { opacity: opacityAnim },
        style
      ]}
    />
  )
}

export default SkeletonLoader
