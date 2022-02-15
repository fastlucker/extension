import { useCallback, useRef, useState } from 'react'
import { Keyboard } from 'react-native'

export default function useBottomSheet() {
  const sheetRef = useRef<any>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openBottomSheet = useCallback(() => {
    setIsOpen(true)
    setTimeout(() => sheetRef.current?.snapTo(1), 100)
  }, [])
  const closeBottomSheet = useCallback(() => {
    setIsOpen(false)
    sheetRef.current?.snapTo(0)

    Keyboard.dismiss()
  }, [])

  return { sheetRef, openBottomSheet, closeBottomSheet, isOpen }
}
