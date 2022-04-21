import { BlurView } from 'expo-blur'
import React from 'react'
import { Animated, StyleSheet } from 'react-native'

import { isiOS } from '@config/env'
import { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { colorPalette as colors } from '@modules/common/styles/colors'

const Backdrop = (props: BottomSheetBackdropProps) => {
  return (
    <BottomSheetBackdrop
      {...props}
      opacity={1}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
    >
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
    </BottomSheetBackdrop>
  )
}

const MemoizedBackdrop = React.memo(Backdrop)

export default MemoizedBackdrop
