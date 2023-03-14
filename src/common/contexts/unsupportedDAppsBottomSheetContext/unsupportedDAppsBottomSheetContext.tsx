import React, { createContext } from 'react'

import { UnsupportedDAppsBottomSheetContextReturnType } from './types'

const UnsupportedDAppsBottomSheetContext =
  createContext<UnsupportedDAppsBottomSheetContextReturnType>({
    closeBottomSheet: () => {}
  })

// This context currently is needed for the Android app only. For iOS/web/extension, fallback to defaults.
const UnsupportedDAppsBottomSheetProvider: React.FC<any> = ({ children }) => children

export { UnsupportedDAppsBottomSheetContext, UnsupportedDAppsBottomSheetProvider }
