import React, { createContext, useMemo } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import spacings from '@common/styles/spacings'
import AccountChanger from '@config/Router/Header/AccountChanger'
import NetworkChanger from '@config/Router/Header/NetworkChanger'

import styles from './styles'

export interface HeaderBottomSheetContextReturnType {
  openHeaderBottomSheet: (dest?: 'top' | 'default' | undefined) => void
  closeHeaderBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

const HeaderBottomSheetContext = createContext<HeaderBottomSheetContextReturnType>({
  openHeaderBottomSheet: () => {},
  closeHeaderBottomSheet: () => {}
})

const HeaderBottomSheetProvider: React.FC = ({ children }) => {
  const {
    ref: sheetRef,
    open: openHeaderBottomSheet,
    close: closeHeaderBottomSheet
  } = useModalize()

  return (
    <HeaderBottomSheetContext.Provider
      value={useMemo(
        () => ({
          closeHeaderBottomSheet,
          openHeaderBottomSheet
        }),
        [closeHeaderBottomSheet, openHeaderBottomSheet]
      )}
    >
      {children}
      <BottomSheet
        id="header-switcher"
        sheetRef={sheetRef}
        closeBottomSheet={closeHeaderBottomSheet}
        displayCancel={false}
      >
        <NetworkChanger closeBottomSheet={closeHeaderBottomSheet} />
        <View style={[styles.separator, spacings.mb]} />
        <AccountChanger closeBottomSheet={closeHeaderBottomSheet} />
      </BottomSheet>
    </HeaderBottomSheetContext.Provider>
  )
}

export { HeaderBottomSheetContext, HeaderBottomSheetProvider }
