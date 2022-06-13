import { useContext } from 'react'

import { HeaderBottomSheetContext } from '@modules/common/contexts/headerBottomSheetContext'

export default function useHeaderBottomSheet() {
  const context = useContext(HeaderBottomSheetContext)

  if (!context) {
    throw new Error('useHeaderBottomSheet must be used within an HeaderBottomSheetProvider')
  }

  return context
}
