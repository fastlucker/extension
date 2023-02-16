import React, { createContext } from 'react'

import { UnsupportedDAppsBottomSheetContextReturnType } from './types'

const UnsupportedDAppsBottomSheetContext =
  createContext<UnsupportedDAppsBottomSheetContextReturnType>({
    closeBottomSheet: () => {}
  })

const UnsupportedDAppsBottomSheetProvider: React.FC<any> = ({ children }) => children

export { UnsupportedDAppsBottomSheetContext, UnsupportedDAppsBottomSheetProvider }
