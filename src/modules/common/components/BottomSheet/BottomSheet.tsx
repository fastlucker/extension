import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Animated, { greaterThan } from 'react-native-reanimated'
import ReanimatedBottomSheet from 'reanimated-bottom-sheet'

import { Portal } from '@gorhom/portal'
import colors from '@modules/common/styles/colors'
import { DEVICE_HEIGHT } from '@modules/common/styles/spacings'

import Button from '../Button'
import styles, { BOTTOM_SHEET_FULL_HEIGHT } from './styles'

interface Props {
  sheetRef: React.RefObject<any>
  cancelText?: string
  displayCancel?: boolean
  maxInitialHeightPercentage?: number
  onCloseEnd?: () => void
}

const BottomSheet: React.FC<Props> = ({
  sheetRef,
  children,
  displayCancel = true,
  cancelText: _cancelText,
  maxInitialHeightPercentage = 0.6,
  onCloseEnd
}) => {
  const { t } = useTranslation()
  const [contentHeight, setContentHeight] = useState(0)
  const [bottomSheetY] = useState(new Animated.Value(1))

  const cancelText = _cancelText || (t('Cancel') as string)

  const handleClose = () => sheetRef.current?.snapTo(0)

  /**
   * Get the content height, so that the modal pops out dynamically,
   * based on the content (so that the content is always visible)
   */
  const handleOnLayout = (e: any): void => {
    const height = Math.round(e.nativeEvent.layout.height)
    const maxHeight = DEVICE_HEIGHT * maxInitialHeightPercentage

    // Use flexible height for the content,
    // so that the content is mostly always fully visible,
    // but only up to certain percent of the fill screen height.
    setContentHeight(Math.min(height, maxHeight))
  }

  const renderContent = () => (
    <View style={styles.containerWrapper}>
      <View style={styles.containerInnerWrapper} onLayout={handleOnLayout}>
        <View style={styles.dragger} />
        {children}
        {displayCancel && (
          <Button onPress={handleClose} style={styles.cancelBtn} text={cancelText} />
        )}
      </View>
    </View>
  )

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
        snapPoints={[0, contentHeight, BOTTOM_SHEET_FULL_HEIGHT]}
        renderContent={renderContent}
        // So that the content is tap-able on Android
        enabledContentTapInteraction={false}
        callbackNode={bottomSheetY}
        borderRadius={15}
        onCloseEnd={onCloseEnd}
      />
    </Portal>
  )
}

export default BottomSheet
