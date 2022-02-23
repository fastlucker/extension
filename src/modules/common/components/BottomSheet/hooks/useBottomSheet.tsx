import { useCallback, useRef, useState } from 'react'
import { Keyboard } from 'react-native'

export default function useBottomSheet() {
  const sheetRef = useRef<any>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openBottomSheet = useCallback(() => {
    setIsOpen(true)
  }, [])
  const closeBottomSheet = useCallback(() => {
    setIsOpen(false)

    Keyboard.dismiss()
  }, [])

  return { sheetRef, openBottomSheet, closeBottomSheet, isOpen }
}
