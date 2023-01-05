import React, { createContext, useMemo } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isWeb } from '@config/env'
import AccountChanger from '@config/Router/Header/AccountChanger'
import NetworkChanger from '@config/Router/Header/NetworkChanger'
import BottomSheet from '@modules/common/components/BottomSheet'
import spacings from '@modules/common/styles/spacings'

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
        <NetworkChanger />
        <View style={[styles.separator, spacings.mb]} />
        <AccountChanger closeBottomSheet={closeHeaderBottomSheet} />
      </BottomSheet>
    </HeaderBottomSheetContext.Provider>
  )
}

export { HeaderBottomSheetContext, HeaderBottomSheetProvider }
