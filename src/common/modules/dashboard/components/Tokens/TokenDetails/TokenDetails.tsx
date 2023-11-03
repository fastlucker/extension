import React, { useEffect } from 'react'
import { Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { TokenResult } from '@ambire-common/libs/portfolio'
import useTheme from '@common/hooks/useTheme'
import { Portal } from '@gorhom/portal'
import { getUiType } from '@web/utils/uiType'

import DetailsInner from './DetailsInner'
import getStyles from './styles'

const { isTab } = getUiType()

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const TokenDetails = ({
  token,
  handleClose
}: {
  token: TokenResult | null
  handleClose: () => void
}) => {
  const [debouncedToken, setDebouncedToken] = React.useState<TokenResult | null>(null)
  const bottom = useSharedValue(isTab ? 0 : -400)
  const opacity = useSharedValue(isTab ? 0 : 1)
  const scale = useSharedValue(isTab ? 0.5 : 1)

  const { styles } = useTheme(getStyles)

  useEffect(() => {
    if (!debouncedToken && token) {
      setDebouncedToken(token)
      return
    }

    const timeout = setTimeout(() => {
      setDebouncedToken(token)
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [token, debouncedToken])

  useEffect(() => {
    // Tab animation
    if (isTab) {
      if (token && opacity.value !== 1 && scale.value !== 1) {
        opacity.value = withTiming(1, { duration: 150 })
        scale.value = withTiming(1, { duration: 200 })
      } else {
        opacity.value = withTiming(0, { duration: 150 })
        scale.value = withTiming(0.5, { duration: 200 })
      }

      return
    }

    // Popup animation
    if (token && bottom.value !== 0) {
      bottom.value = withTiming(0, { duration: 200 })
    } else {
      bottom.value = withTiming(-400, { duration: 200 })
    }
  }, [token, bottom, opacity, scale])

  const reanimatedStyle = useAnimatedStyle(() => ({
    bottom: bottom.value,
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }))

  return (
    <Portal hostName="global">
      <Pressable
        onPress={handleClose}
        style={[
          styles.container,
          {
            display: debouncedToken ? 'flex' : 'none'
          }
        ]}
      >
        <AnimatedPressable style={[styles.content, reanimatedStyle]}>
          <DetailsInner token={debouncedToken} handleClose={handleClose} />
        </AnimatedPressable>
      </Pressable>
    </Portal>
  )
}

export default TokenDetails
