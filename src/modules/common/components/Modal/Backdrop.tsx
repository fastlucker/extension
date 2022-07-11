import { BlurView } from 'expo-blur'
import React from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CloseIcon from '@assets/svg/CloseIcon'
import { isiOS } from '@config/env'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import { colorPalette as colors } from '@modules/common/styles/colors'

import styles from './styles'

const Backdrop = ({ isVisible, onPress }: { isVisible: boolean; onPress: () => void }) => {
  const insets = useSafeAreaInsets()
  // The header should start a little bit below the end of the notch,
  // and right in the vertical middle of the nav.
  const notchInset = insets.top + 10
  return (
    <View
      style={[styles.backDropWrapper, !isVisible && { opacity: 0 }]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <TouchableOpacity style={styles.backDrop} activeOpacity={1} onPress={onPress}>
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
    </View>
  )
}

export default React.memo(Backdrop)
