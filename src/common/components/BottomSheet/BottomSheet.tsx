import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BackHandler, View, ViewStyle } from 'react-native'
import { Modalize, ModalizeProps } from 'react-native-modalize'

import { isWeb } from '@common/config/env'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import { HEADER_HEIGHT } from '@common/modules/header/components/Header/styles'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import { Portal } from '@gorhom/portal'
import useIsScrollable from '@web/hooks/useIsScrollable'
import { getUiType } from '@web/utils/uiType'

import Backdrop from './Backdrop'
import getStyles from './styles'

interface Props {
  id: string
  sheetRef: React.RefObject<Modalize>
  closeBottomSheet?: (dest?: 'alwaysOpen' | 'default' | undefined) => void
  onBackdropPress?: () => void
  onClosed?: () => void
  onOpen?: () => void
  children?: React.ReactNode
  // Preferences
  type?: 'modal' | 'bottom-sheet'
  adjustToContentHeight?: boolean
  style?: ViewStyle
  containerInnerWrapperStyles?: ViewStyle
  flatListProps?: ModalizeProps['flatListProps']
  scrollViewProps?: ModalizeProps['scrollViewProps']
  backgroundColor?: 'primaryBackground' | 'secondaryBackground'
  autoWidth?: boolean
  autoOpen?: boolean
  shouldBeClosableOnDrag?: boolean
  customZIndex?: number
}

const ANIMATION_DURATION: number = 250

const { isPopup } = getUiType()

const BottomSheet: React.FC<Props> = ({
  // Unique identifier for the bottom sheet
  id,
  type: _type,
  sheetRef,
  children,
  closeBottomSheet = () => {},
  adjustToContentHeight = true,
  style = {},
  containerInnerWrapperStyles = {},
  onClosed,
  onOpen,
  onBackdropPress,
  flatListProps,
  scrollViewProps,
  backgroundColor = 'secondaryBackground',
  autoWidth = false,
  autoOpen = false,
  shouldBeClosableOnDrag = true,
  customZIndex
}) => {
  const type = _type || (isPopup ? 'bottom-sheet' : 'modal')
  const isModal = type === 'modal'
  const { styles, theme } = useTheme(getStyles)
  const [isOpen, setIsOpen] = useState(false)
  const prevIsOpen = usePrevious(isOpen)
  const [isBackdropVisible, setIsBackdropVisible] = useState(false)
  const { isScrollable, checkIsScrollable, scrollViewRef } = useIsScrollable()

  const autoOpened: React.MutableRefObject<boolean> = useRef(false)
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      sheetRef.current = node
      // check if component is mounted and if should autoOpen
      if (autoOpen && sheetRef.current && !autoOpened.current) {
        sheetRef.current.open()
        autoOpened.current = !autoOpened.current // ensure that the bottom sheet auto-opens only once
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoOpen]
  )

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
    if (isPopup && isModal) return 0
    if (isWeb) return HEADER_HEIGHT - 20

    return HEADER_HEIGHT + 10
  }, [isModal])

  return (
    <Portal hostName="global">
      {!!isBackdropVisible && (
        <Backdrop
          isVisible={isBackdropVisible}
          isBottomSheetVisible={isOpen}
          customZIndex={customZIndex ? customZIndex - 1 : undefined}
          onPress={() => {
            closeBottomSheet()
            !!onBackdropPress && onBackdropPress()
          }}
        />
      )}
      <Modalize
        // The key is used to force the re-render of the component when there is an opened
        // bottom sheet and the user navigates to a route that also has a bottom sheet. Without
        // this key or without a unique key, the bottom sheet will not close when navigating
        key={id}
        ref={setRef}
        contentRef={scrollViewRef}
        modalStyle={[
          styles.bottomSheet,
          isModal
            ? { ...styles.modal, ...(autoWidth ? { maxWidth: 'unset', width: 'auto' } : {}) }
            : {},
          { backgroundColor: theme[backgroundColor] },
          isPopup && isModal ? { height: '100%' } : {},
          style
        ]}
        rootStyle={[
          styles.root,
          isPopup && isModal ? spacings.phSm : {},
          {
            zIndex: customZIndex || styles.root.zIndex
          }
        ]}
        handleStyle={[
          styles.dragger,
          isModal
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
        panGestureEnabled={shouldBeClosableOnDrag}
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
        onLayout={checkIsScrollable}
        onOpen={() => {
          setIsOpen(true)
          setIsBackdropVisible(true)
          !!onOpen && onOpen()
        }}
        onClose={() => setIsOpen(false)}
        onClosed={() => !!onClosed && onClosed()}
      >
        {!flatListProps && (
          <View
            testID={isOpen ? 'bottom-sheet' : undefined}
            style={[
              isScrollable ? spacings.prTy : {},
              common.fullWidth,
              containerInnerWrapperStyles
            ]}
          >
            {children}
          </View>
        )}
      </Modalize>
    </Portal>
  )
}

export default React.memo(BottomSheet)
