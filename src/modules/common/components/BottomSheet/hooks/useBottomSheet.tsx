import { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import usePrevious from '@modules/common/hooks/usePrevious'

export default function useBottomSheet() {
  const isInitialOpen = useRef<boolean>(true)
  const sheetRef = useRef<BottomSheet>(null)
  const [isOpen, setIsOpen] = useState(false)
  const prevIsOpen = usePrevious(isOpen)

  useEffect(() => {
    if (!prevIsOpen && isOpen) {
      if (isInitialOpen.current) {
        // TODO: find a better solution
        // Waits for the bottom sheet to finish the dynamic calculations of it's content height
        // Once calculated there is no need to wait it anymore
        setTimeout(() => {
          sheetRef.current?.snapToIndex(0)
        }, 200)
        isInitialOpen.current = false
      } else {
        sheetRef.current?.snapToIndex(0)
      }
    }
  }, [isOpen])

  const openBottomSheet = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeBottomSheet = useCallback(() => {
    setIsOpen(false)
    sheetRef.current?.close()

    Keyboard.dismiss()
  }, [])

  return { sheetRef, isOpen, openBottomSheet, closeBottomSheet }
}
