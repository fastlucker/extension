import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HEADER_HEIGHT } from '@config/Router/Header/style'
import RNBottomSheet, {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import Button from '@modules/common/components/Button'
import { DEVICE_HEIGHT } from '@modules/common/styles/spacings'

import Backdrop from './Backdrop'
import styles from './styles'

interface Props {
  id?: string
  // Required in order all bottom sheet related events to click
  sheetRef: React.RefObject<any>
  closeBottomSheet: () => void
  children: React.ReactNode
  // Preferences
  cancelText?: string
  displayCancel?: boolean
  maxInitialHeightPercentage?: number
  dynamicInitialHeight?: boolean
  isOpen: boolean
}

const BottomSheet: React.FC<Props> = ({
  id,
  sheetRef,
  children,
  displayCancel = true,
  cancelText: _cancelText,
  dynamicInitialHeight = true,
  isOpen = false,
  closeBottomSheet = () => {}
}) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  // The header should start a little bit below the end of the notch,
  // and right in the vertical middle of the nav.
  const notchInset = insets.top + 10

  const BOTTOM_SHEET_DRAGGER_HEIGHT = 20
  const BOTTOM_SHEET_MAX_HEIGHT = useMemo(() => DEVICE_HEIGHT - notchInset - HEADER_HEIGHT, [])
  const BOTTOM_SHEET_MAX_CONTENT_HEIGHT = BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_DRAGGER_HEIGHT

  const initialDynamicSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], [])

  const staticSnapPoints = useMemo(() => [BOTTOM_SHEET_MAX_HEIGHT], [BOTTOM_SHEET_MAX_HEIGHT])

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialDynamicSnapPoints)

  const handleSheetChange = useCallback((index: number) => {
    if (isOpen && index === -1) !!closeBottomSheet && closeBottomSheet()
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
      <BottomSheetScrollView
        onLayout={({
          nativeEvent: {
            layout: { height }
          }
        }: any) => {
          handleContentLayout({
            nativeEvent: {
              layout: {
                height:
                  height > BOTTOM_SHEET_MAX_CONTENT_HEIGHT || !height
                    ? BOTTOM_SHEET_MAX_CONTENT_HEIGHT
                    : height
              }
            }
          })
        }}
        style={{ maxHeight: BOTTOM_SHEET_MAX_HEIGHT }}
        alwaysBounceVertical={false}
      >
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

  return (
    <Portal hostName="global">
      <RNBottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={dynamicInitialHeight ? animatedSnapPoints : staticSnapPoints}
        {...(dynamicInitialHeight ? { topInset: DEVICE_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT } : {})}
        {...(dynamicInitialHeight ? { handleHeight: animatedHandleHeight } : {})}
        contentHeight={
          dynamicInitialHeight ? animatedContentHeight : BOTTOM_SHEET_MAX_CONTENT_HEIGHT
        }
        enablePanDownToClose
        enableOverDrag={false}
        animateOnMount
        keyboardBlurBehavior="restore"
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={styles.dragger}
        backdropComponent={isOpen ? Backdrop : null}
        onChange={handleSheetChange}
        onClose={closeBottomSheet}
      >
        {renderContent}
      </RNBottomSheet>
    </Portal>
  )
}

export default BottomSheet
