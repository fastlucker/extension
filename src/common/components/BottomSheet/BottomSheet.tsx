import React, { useEffect, useMemo, useState } from 'react'
import { BackHandler, View, ViewStyle } from 'react-native'
import { Modalize, ModalizeProps } from 'react-native-modalize'

import { isWeb } from '@common/config/env'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import { HEADER_HEIGHT } from '@common/modules/header/components/Header/styles'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import { Portal } from '@gorhom/portal'
import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'
import { getUiType } from '@web/utils/uiType'

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
  containerInnerWrapperStyles?: ViewStyle
  flatListProps?: ModalizeProps['flatListProps']
  scrollViewProps?: ModalizeProps['scrollViewProps']
  forceModal?: boolean
}

const ANIMATION_DURATION: number = 250

const { isTab, isPopup } = getUiType()

const BottomSheet: React.FC<Props> = ({
  // Useful for debugging and generally knowing which bottom sheet is triggered
  // eslint-disable-next-line
  id,
  sheetRef,
  children,
  closeBottomSheet = () => {},
  adjustToContentHeight = true,
  style = {},
  containerInnerWrapperStyles = {},
  onClosed,
  onBackdropPress,
  flatListProps,
  scrollViewProps,
  forceModal = false
}) => {
  const { styles } = useTheme(getStyles)
  const [isOpen, setIsOpen] = useState(false)
  const prevIsOpen = usePrevious(isOpen)
  const [isBackdropVisible, setIsBackdropVisible] = useState(false)

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

  const modalTopOffset = useMemo(() => {
    if (isPopup && forceModal) return 0
    if (isWeb) return HEADER_HEIGHT - 20

    return HEADER_HEIGHT + 10
  }, [forceModal])

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
        modalStyle={[
          styles.bottomSheet,
          isTab || forceModal
            ? {
                borderBottomEndRadius: BORDER_RADIUS_PRIMARY,
                borderBottomStartRadius: BORDER_RADIUS_PRIMARY,
                maxWidth: TAB_CONTENT_WIDTH,
                width: '100%',
                margin: 'auto'
              }
            : {},
          isPopup && !forceModal ? { paddingTop: 23 } : {},
          isPopup && forceModal ? { height: '100%' } : {},
          style
        ]}
        rootStyle={[styles.root, isPopup && forceModal ? spacings.phSm : {}]}
        handleStyle={[
          styles.dragger,
          isTab || forceModal
            ? {
                display: 'none'
              }
            : {}
        ]}
        handlePosition="inside"
        useNativeDriver={!isWeb}
        avoidKeyboardLikeIOS
        modalTopOffset={modalTopOffset}
        threshold={90}
        adjustToContentHeight={adjustToContentHeight}
        disableScrollIfPossible={false}
        withOverlay={false}
        onBackButtonPress={() => true}
        {...(!flatListProps
          ? {
              scrollViewProps: {
                bounces: false,
                keyboardShouldPersistTaps: 'handled',
                ...(scrollViewProps || {})
              }
            }
          : {})}
        {...(flatListProps
          ? {
              flatListProps: {
                bounces: false,
                keyboardShouldPersistTaps: 'handled',
                contentContainerStyle: styles.containerInnerWrapper,
                ...(flatListProps || {})
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
        {!flatListProps && (
          <View style={[styles.containerInnerWrapper, containerInnerWrapperStyles]}>
            {children}
          </View>
        )}
      </Modalize>
    </Portal>
  )
}

export default React.memo(BottomSheet)
