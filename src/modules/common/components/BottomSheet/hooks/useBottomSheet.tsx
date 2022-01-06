import { useRef } from 'react'

export default function useBottomSheet() {
  const sheetRef = useRef<any>(0)
  const openBottomSheet = () => sheetRef.current?.snapTo(1)
  const closeBottomSheet = () => sheetRef.current?.snapTo(0)

  return { sheetRef, openBottomSheet, closeBottomSheet }
}
