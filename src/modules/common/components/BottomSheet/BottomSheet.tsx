import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Animated, { greaterThan } from 'react-native-reanimated'
import ReanimatedBottomSheet from 'reanimated-bottom-sheet'

import { Portal } from '@gorhom/portal'
import colors from '@modules/common/styles/colors'
import { DEVICE_HEIGHT } from '@modules/common/styles/spacings'

import Button, { BUTTON_TYPES } from '../Button'
import styles, { BOTTOM_SHEET_FULL_HEIGHT } from './styles'

interface Props {
  // Useful for debugging and generally knowing which bottom sheet gets triggered
  id?: string
  // Required in order all bottom sheet related events to click
  sheetRef: React.RefObject<any>
  closeBottomSheet: () => void
  isOpen: boolean
  children: React.ReactNode
  // Preferences
  cancelText?: string
  displayCancel?: boolean
  maxInitialHeightPercentage?: number
  dynamicInitialHeight?: boolean
}

const BottomSheet: React.FC<Props> = ({
  id,
  sheetRef,
  children,
  displayCancel = true,
  cancelText: _cancelText,
  maxInitialHeightPercentage = 0.6,
  dynamicInitialHeight = true,
  closeBottomSheet = () => {},
  isOpen = false
}) => {
  const { t } = useTranslation()
  const [contentHeight, setContentHeight] = useState(0)
  const [bottomSheetY] = useState(new Animated.Value(1))

  const cancelText = _cancelText || (t('✗  Cancel') as string)

  const handleOnCloseEnd = () => {
    closeBottomSheet()
  }

  /**
   * Get the content height, so that the modal pops out dynamically,
   * based on the content (so that the content is always visible)
   */
  const handleOnLayout = (e: any): void => {
    const height = Math.round(e.nativeEvent.layout.height)
    const maxHeight = DEVICE_HEIGHT * maxInitialHeightPercentage

    if (!dynamicInitialHeight) {
      return setContentHeight(maxHeight)
    }

    // Use flexible height for the content,
    // so that the content is mostly always fully visible,
    // but only up to certain percent of the fill screen height.
    setContentHeight(Math.min(height, maxHeight))
  }

  const renderContent = () => {
    if (!isOpen) {
      return null
    }

    return (
      <View style={styles.containerWrapper}>
        <View style={styles.containerInnerWrapper} onLayout={handleOnLayout}>
          <View style={styles.dragger} />
          {children}
          {displayCancel && (
            <Button
              type={BUTTON_TYPES.SECONDARY}
              onPress={handleOnCloseEnd}
              style={styles.cancelBtn}
              text={cancelText}
            />
          )}
        </View>
      </View>
    )
  }

  const animatedShadowOpacity = Animated.interpolateNode(bottomSheetY, {
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [0.9, 0.8, 0.7, 0]
  })

  // Disable pointer events so that the overlay is not clickable
  // {@link https://github.com/osdnk/react-native-reanimated-bottom-sheet/issues/138#issuecomment-772803302}
  const clickThrough = Animated.cond(
    greaterThan(
      bottomSheetY,
      // start immediately when the bottom sheets gets visible
      0.99
    ),
    'none', // misleadingly, but it actually ENABLES pointer events
    'auto' // misleadingly, but it actually DISABLES pointer events
  )

  return (
    <Portal hostName="global">
      <Animated.View
        pointerEvents={clickThrough}
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: colors.backgroundColor,
            opacity: animatedShadowOpacity
          }
        ]}
      />
      <ReanimatedBottomSheet
        ref={sheetRef}
        snapPoints={
          dynamicInitialHeight
            ? [0, contentHeight, BOTTOM_SHEET_FULL_HEIGHT]
            : [0, BOTTOM_SHEET_FULL_HEIGHT]
        }
        renderContent={renderContent}
        // So that the content is tap-able on Android
        enabledContentTapInteraction={false}
        callbackNode={bottomSheetY}
        borderRadius={15}
        onCloseEnd={handleOnCloseEnd}
        // These are not consistent.
        // onOpenEnd={() => console.log('open end')}
        // onOpenStart={() => console.log('open start')}
      />
    </Portal>
  )
}

export default React.memo(BottomSheet)
