import { useRef } from 'react'
import { Keyboard } from 'react-native'

export default function useBottomSheet() {
  const sheetRef = useRef<any>(0)
  const openBottomSheet = () => sheetRef.current?.snapTo(1)
  const closeBottomSheet = (ref: any = sheetRef) => {
    ref.current?.snapTo(0)

    Keyboard.dismiss()
  }

  return { sheetRef, openBottomSheet, closeBottomSheet }
}
