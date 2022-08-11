import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HEADER_HEIGHT } from '@config/Router/Header/style'
import { Portal } from '@gorhom/portal'
import Button from '@modules/common/components/Button'
import { DEVICE_HEIGHT } from '@modules/common/styles/spacings'

import Backdrop from './Backdrop'
import { UseBottomSheetReturnType } from './hooks/useBottomSheet'
import styles from './styles'

interface Props {
  id?: string
  // Required in order all bottom sheet related events to click
  sheetRef: React.RefObject<any>
  closeBottomSheet: UseBottomSheetReturnType['closeBottomSheet']
  isOpen: boolean
  children: React.ReactNode
  // Preferences
  cancelText?: string
  displayCancel?: boolean
}

const BottomSheet: React.FC<Props> = ({
  // Useful for debugging and generally knowing which bottom sheet is triggered
  // eslint-disable-next-line
  id,
  sheetRef,
  children,
  displayCancel = true,
  cancelText: _cancelText,
  isOpen = false,
  closeBottomSheet = () => {}
}) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  // The header should start a little bit below the end of the notch,
  // and right in the vertical middle of the nav.
  const notchInset = insets.top + 10

  const BOTTOM_SHEET_MAX_HEIGHT = DEVICE_HEIGHT - notchInset - HEADER_HEIGHT

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

  return (
    <Portal hostName="global">
      <Modalize
        ref={sheetRef}
        modalStyle={styles.bottomSheet}
        handleStyle={styles.dragger}
        handlePosition="inside"
        modalTopOffset={DEVICE_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT}
        threshold={100}
        adjustToContentHeight
        disableScrollIfPossible={false}
        scrollViewProps={{
          bounces: false
        }}
        openAnimationConfig={{
          timing: { duration: 250, delay: 0 }
        }}
      >
        <View style={styles.containerInnerWrapper}>
          {children}
          {displayCancel && (
            <Button
              type="ghost"
              onPress={closeBottomSheet}
              style={styles.cancelBtn}
              text={cancelText}
              hitSlop={{ top: 15, bottom: 15 }}
            />
          )}
        </View>
      </Modalize>
    </Portal>
  )
}

export default BottomSheet
