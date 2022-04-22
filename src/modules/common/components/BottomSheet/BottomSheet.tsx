import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import RNBottomSheet, {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { DEVICE_HEIGHT } from '@modules/common/styles/spacings'

import Button from '../Button'
import Backdrop from './Backdrop'
import styles from './styles'

interface Props {
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
  sheetRef,
  children,
  displayCancel = true,
  cancelText: _cancelText,
  dynamicInitialHeight = true,
  closeBottomSheet = () => {}
}) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  // The header should start a little bit below the end of the notch,
  // and right in the vertical middle of the nav.
  const notchInset = insets.top + 10
  const BOTTOM_SHEET_FULL_HEIGHT = DEVICE_HEIGHT - notchInset
  const [isOpen, setIsOpen] = useState(false)
  const initialSnapPoints = useMemo(() => [BOTTOM_SHEET_FULL_HEIGHT * 0.9], [])

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints)

  const handleSheetAnimate = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex !== -1) {
      setIsOpen(true)
    } else setIsOpen(false)
  }, [])

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

  const cancelText = _cancelText || (t('Cancel') as string)

  const renderContent = () => {
    // Prevent rendering the bottom sheet content if the bottom sheet is closed,
    // otherwise - children gets mounted behind the scenes (invisible),
    // and this create some complications for:
    // 1) focusing elements when they appear on screen
    // 2) performance
    if (!isOpen) {
      return null
    }

    return (
      <BottomSheetScrollView onLayout={handleContentLayout} alwaysBounceVertical={false}>
        <View style={styles.containerInnerWrapper}>
          {children}
          {displayCancel && (
            <Button
              type="ghost"
              onPress={closeBottomSheet}
              style={styles.cancelBtn}
              text={cancelText}
            />
          )}
        </View>
      </BottomSheetScrollView>
    )
  }

  const staticSnapPoints = useMemo(() => [BOTTOM_SHEET_FULL_HEIGHT * 0.9], [])

  return (
    <Portal hostName="global">
      <RNBottomSheet
        ref={sheetRef}
        index={-1}
        topInset={notchInset}
        snapPoints={dynamicInitialHeight ? animatedSnapPoints : staticSnapPoints}
        {...(dynamicInitialHeight ? { handleHeight: animatedHandleHeight } : {})}
        {...(dynamicInitialHeight ? { contentHeight: animatedContentHeight } : {})}
        enablePanDownToClose
        enableOverDrag={false}
        animateOnMount
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={styles.dragger}
        backdropComponent={Backdrop}
        onAnimate={handleSheetAnimate}
        onClose={closeBottomSheet}
      >
        {renderContent}
      </RNBottomSheet>
    </Portal>
  )
}

export default React.memo(BottomSheet)
