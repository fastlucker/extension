import React, { createContext, useCallback, useMemo } from 'react'

import { useBottomSheetInternal } from '@gorhom/bottom-sheet'

type BottomSheetInputContextData = {
  setShouldHandleKeyboardEvents: (value: boolean) => void
}

const BottomSheetInputContext = createContext<BottomSheetInputContextData>({
  setShouldHandleKeyboardEvents: () => {}
})

const BottomSheetInputProvider: React.FC = ({ children }) => {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal()

  const setShouldHandleKeyboardEvents = useCallback((value: boolean) => {
    shouldHandleKeyboardEvents.value = value
  }, [])

  return (
    <BottomSheetInputContext.Provider
      value={useMemo(
        () => ({
          setShouldHandleKeyboardEvents
        }),
        [setShouldHandleKeyboardEvents]
      )}
    >
      {children}
    </BottomSheetInputContext.Provider>
  )
}

export { BottomSheetInputContext, BottomSheetInputProvider }
