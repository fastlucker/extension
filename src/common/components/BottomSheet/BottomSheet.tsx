import React, { useEffect, useState } from 'react'
import { BackHandler, View, ViewStyle } from 'react-native'
import { Modalize, ModalizeProps } from 'react-native-modalize'

import { isWeb } from '@common/config/env'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import { HEADER_HEIGHT } from '@common/modules/header/components/Header/styles'
import { Portal } from '@gorhom/portal'

import Backdrop from './Backdrop'
import getStyles from './styles'

interface Props {
  id?: string
  sheetRef: React.RefObject<Modalize>
  closeBottomSheet: (dest?: 'alwaysOpen' | 'default' | undefined) => void
  onBackdropPress?: () => void
  onClosed?: () => void
  children?: React.ReactNode
  // Preferences
  adjustToContentHeight?: boolean
  style?: ViewStyle
  flatListProps?: ModalizeProps['flatListProps']
}

const ANIMATION_DURATION: number = 250

const BottomSheet: React.FC<Props> = ({
  // Useful for debugging and generally knowing which bottom sheet is triggered
  // eslint-disable-next-line
  id,
  sheetRef,
  children,
  closeBottomSheet = () => {},
  adjustToContentHeight = true,
  style = {},
  onClosed,
  onBackdropPress,
  flatListProps
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const prevIsOpen = usePrevious(isOpen)
  const [isBackdropVisible, setIsBackdropVisible] = useState(false)
  const { styles } = useTheme(getStyles)
  useEffect(() => {
    if (prevIsOpen && !isOpen) {
      setTimeout(() => {
        // Delays the backdrop unmounting because of the closing animation duration
        setIsBackdropVisible(false)
      }, ANIMATION_DURATION)
    }
  }, [isOpen, prevIsOpen])

  // Hook up the back button (or action) to close the bottom sheet
  useEffect(() => {
    if (!isOpen) return

    const backAction = () => {
      if (isOpen) {
        closeBottomSheet()
        // Returning true prevents execution of the default native back handling
        return true
      }

      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove()
  }, [closeBottomSheet, isOpen])

  return (
    <Portal hostName="global">
      {!!isBackdropVisible && (
        <Backdrop
          isVisible={isBackdropVisible}
          isBottomSheetVisible={isOpen}
          onPress={() => {
            closeBottomSheet()
            !!onBackdropPress && onBackdropPress()
          }}
        />
      )}
      <Modalize
        ref={sheetRef}
        modalStyle={[styles.bottomSheet, style]}
        rootStyle={styles.root}
        handleStyle={styles.dragger}
        handlePosition="inside"
        useNativeDriver={!isWeb}
        avoidKeyboardLikeIOS
        modalTopOffset={isWeb ? HEADER_HEIGHT - 20 : HEADER_HEIGHT + 10}
        threshold={90}
        adjustToContentHeight={adjustToContentHeight}
        disableScrollIfPossible={false}
        withOverlay={false}
        onBackButtonPress={() => true}
        {...(!flatListProps
          ? {
              scrollViewProps: {
                bounces: false,
                keyboardShouldPersistTaps: 'handled'
              }
            }
          : {})}
        {...(flatListProps
          ? {
              flatListProps: {
                bounces: false,
                keyboardShouldPersistTaps: 'handled',
                contentContainerStyle: styles.containerInnerWrapper,
                ...flatListProps
              }
            }
          : {})}
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
        onClosed={() => !!onClosed && onClosed()}
      >
        {!flatListProps && <View style={styles.containerInnerWrapper}>{children}</View>}
      </Modalize>
    </Portal>
  )
}

export default React.memo(BottomSheet)
