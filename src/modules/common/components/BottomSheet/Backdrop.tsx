import { BlurView } from 'expo-blur'
import React, { useEffect, useState } from 'react'
import { Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CloseIcon from '@assets/svg/CloseIcon'
import { isiOS } from '@config/env'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

interface Props {
  isBottomSheetVisible: boolean
  isVisible: boolean
  onPress: () => void
}

const ANIMATION_DURATION: number = 250

const Backdrop = ({ isBottomSheetVisible, isVisible, onPress }: Props) => {
  // const opacity = React.useRef(new Animated.Value(0)).current
  const [opacity] = useState(new Animated.Value(0))
  const insets = useSafeAreaInsets()
  // The header should start a little bit below the end of the notch,
  // and right in the vertical middle of the nav.
  const notchInset = insets.top + 10

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      easing: Easing.linear,
      useNativeDriver: true
    }).start()
  }, [])

  useEffect(() => {
    if (!isBottomSheetVisible) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true
      }).start()
    }
  }, [isBottomSheetVisible])

  return (
    <Animated.View
      style={[
        styles.backDrop,
        {
          opacity: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
          })
        }
      ]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <TouchableOpacity style={flexboxStyles.flex1} activeOpacity={1} onPress={onPress}>
        <NavIconWrapper onPress={onPress} style={[styles.closeBtn, { top: notchInset }]}>
          <CloseIcon />
        </NavIconWrapper>
        {isiOS ? (
          // The blurred view works on iOS only
          <BlurView
            intensity={55}
            tint="dark"
            style={[
              StyleSheet.absoluteFillObject,
              {
                opacity: 0.98
              }
            ]}
          />
        ) : (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: colors.valhalla,
                opacity: 0.8
              }
            ]}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

export default React.memo(Backdrop)
