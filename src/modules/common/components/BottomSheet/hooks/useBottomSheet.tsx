import { useCallback, useRef } from 'react'
import { Keyboard } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'

export default function useBottomSheet() {
  const sheetRef = useRef<BottomSheet>(null)

  const openBottomSheet = useCallback(() => {
    sheetRef.current?.snapToIndex(0)
  }, [])

  const closeBottomSheet = useCallback(() => {
    sheetRef.current?.close()

    Keyboard.dismiss()
  }, [])

  return { sheetRef, openBottomSheet, closeBottomSheet }
}
