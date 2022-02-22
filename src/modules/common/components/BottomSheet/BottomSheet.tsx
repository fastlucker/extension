import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native'
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
  // id,
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

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const backAction = () => {
      if (isOpen) {
        !!closeBottomSheet && closeBottomSheet()
        // Returning true prevents execution of the default native back handling
        return true
      }

      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove()
  }, [isOpen])

  const cancelText = _cancelText || (t('✗  Cancel') as string)

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
    // Prevent rendering the bottom sheet content if the bottom sheet is closed,
    // otherwise - children gets mounted behind the scenes (invisible),
    // and this create some complications for the 1) focusing elements
    // when they appear on screen; 2) performance
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
              onPress={closeBottomSheet}
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
      {!!isOpen && <TouchableOpacity style={styles.backDrop} onPress={closeBottomSheet} />}
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
        // Trigger the `closeBottomSheet` method on close end,
        // because otherwise - if user drags out the bottom sheet
        // and cancels it this way - the `closeBottomSheet` method
        // logic is not executed. But it is required to, because
        // it includes hiding keyboard, flipping the `isOpen` flag, etc.
        onCloseEnd={closeBottomSheet}
        // Unfortunately, these are not consistent. When component re-renders
        // they tend to not click. So they are not reliable to determine
        // if the bottom sheet is opened or closed, neither to hold any logic.
        // {@link https://github.com/osdnk/react-native-reanimated-bottom-sheet/issues/183}
        // onOpenEnd={() => console.log('open end')}
        // onOpenStart={() => console.log('open start')}
        // onCloseStart={() => console.log('close start')}
      />
    </Portal>
  )
}

export default React.memo(BottomSheet)
