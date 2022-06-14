import React, { createContext, useMemo } from 'react'
import { View } from 'react-native'

import AccountChanger from '@config/Router/Header/AccountChanger'
import NetworkChanger from '@config/Router/Header/NetworkChanger'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet, { UseBottomSheetReturnType } from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import spacings from '@modules/common/styles/spacings'

import styles from './styles'

export interface HeaderBottomSheetContextReturnType {
  closeHeaderBottomSheet: UseBottomSheetReturnType['closeBottomSheet']
  openHeaderBottomSheet: UseBottomSheetReturnType['openBottomSheet']
}

const HeaderBottomSheetContext = createContext<HeaderBottomSheetContextReturnType>({
  closeHeaderBottomSheet: () => {},
  openHeaderBottomSheet: () => {}
})

const HeaderBottomSheetProvider: React.FC = ({ children }) => {
  const {
    sheetRef,
    isOpen,
    closeBottomSheet: closeHeaderBottomSheet,
    openBottomSheet: openHeaderBottomSheet
  } = useBottomSheet()
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
        isOpen={isOpen}
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
