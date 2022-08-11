import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
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
  children: React.ReactNode
  // Preferences
  cancelText?: string
  displayCancel?: boolean
  alwaysOpen?: number
}

const ANIMATION_DURATION: number = 250

const BottomSheet: React.FC<Props> = ({
  // Useful for debugging and generally knowing which bottom sheet is triggered
  // eslint-disable-next-line
  id,
  sheetRef,
  children,
  displayCancel = true,
  cancelText: _cancelText,
  closeBottomSheet = () => {},
  alwaysOpen
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const prevIsOpen = usePrevious(isOpen)
  const [isBackdropVisible, setIsBackdropVisible] = useState(false)

  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  // The header should start a little bit below the end of the notch,
  // and right in the vertical middle of the nav.
  const notchInset = insets.top + 10

  const BOTTOM_SHEET_MAX_HEIGHT = DEVICE_HEIGHT - notchInset - HEADER_HEIGHT

  useEffect(() => {
    if (prevIsOpen && !isOpen) {
      setTimeout(() => {
        setIsBackdropVisible(false)
      }, ANIMATION_DURATION)
    }
  }, [isOpen, prevIsOpen])

  return (
    <Portal hostName="global">
      {isBackdropVisible && (
        <Backdrop
          isVisible={isBackdropVisible}
          isBottomSheetVisible={isOpen}
          onPress={closeBottomSheet}
        />
      )}
      <Modalize
        ref={sheetRef}
        modalStyle={styles.bottomSheet}
        handleStyle={styles.dragger}
        handlePosition="inside"
        modalTopOffset={DEVICE_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT}
        threshold={100}
        adjustToContentHeight
        disableScrollIfPossible={false}
        alwaysOpen={alwaysOpen}
        withOverlay={false}
        onBackButtonPress={() => true}
        scrollViewProps={{
          bounces: false
        }}
        openAnimationConfig={{
          timing: { duration: ANIMATION_DURATION, delay: 0 }
        }}
        closeAnimationConfig={{
          timing: { duration: ANIMATION_DURATION, delay: 0 }
        }}
        onOpen={() => {
          setIsOpen(true)
          setIsBackdropVisible(true)
        }}
        onClose={() => setIsOpen(false)}
      >
        <View style={styles.containerInnerWrapper}>
          {children}
          {displayCancel && (
            <Button
              type="ghost"
              onPress={closeBottomSheet}
              style={styles.cancelBtn}
              text={_cancelText || (t('Cancel') as string)}
              hitSlop={{ top: 15, bottom: 15 }}
            />
          )}
        </View>
      </Modalize>
    </Portal>
  )
}

export default React.memo(BottomSheet)
