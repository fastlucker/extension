import usePrevious from 'ambire-common/src/hooks/usePrevious'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard } from 'react-native'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@gorhom/bottom-sheet'

export interface UseBottomSheetReturnType {
  sheetRef: React.RefObject<BottomSheet>
  isOpen: boolean
  openBottomSheet: () => void
  closeBottomSheet: () => void
}

export default function useBottomSheet(): UseBottomSheetReturnType {
  // const isInitialOpen = useRef<boolean>(true)
  const { ref, open, close } = useModalize()
  const [isOpen, setIsOpen] = useState(false)
  const prevIsOpen = usePrevious(isOpen)

  useEffect(() => {
    if (!prevIsOpen && isOpen) {
      // Waits for the bottom sheet to finish the dynamic calculations of it's
      // content height once calculated there is no need to wait it anymore.
      // TODO: find a better solution #dynamicheightfix
      // if (isInitialOpen.current) {
      // setTimeout(() => {
      // sheetRef.current?.snapToIndex(0)
      // }, 200)
      // isInitialOpen.current = false
      // } else {
      // sheetRef.current?.snapToIndex(0)
      // }
    }
  }, [isOpen])

  const openBottomSheet = useCallback(() => {
    open()
  }, [])

  const closeBottomSheet = useCallback(() => {
    setIsOpen(false)
    close()
    // sheetRef.current?.close()

    Keyboard.dismiss()
  }, [])

  return { sheetRef: ref, isOpen, openBottomSheet, closeBottomSheet }
}
