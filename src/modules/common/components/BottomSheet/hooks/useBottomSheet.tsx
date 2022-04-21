import { useCallback, useRef, useState } from 'react'
import { Keyboard } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'

export default function useBottomSheet() {
  const sheetRef = useRef<BottomSheet>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openBottomSheet = useCallback(() => {
    sheetRef.current?.snapToIndex(0)
    setIsOpen(true)
  }, [])

  const closeBottomSheet = useCallback(() => {
    sheetRef.current?.close()
    setIsOpen(false)

    Keyboard.dismiss()
  }, [])

  return { sheetRef, openBottomSheet, closeBottomSheet, isOpen }
}
