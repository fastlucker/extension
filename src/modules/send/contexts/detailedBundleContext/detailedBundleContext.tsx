import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import { BOTTOM_SHEET_FULL_HEIGHT } from '@modules/common/components/BottomSheet/styles'
import Panel from '@modules/common/components/Panel'
import Wrapper from '@modules/common/components/Wrapper'
import BundleDetailedPreview from '@modules/transactions/components/BundleDetailedPreview'
import BundleSimplePreview from '@modules/transactions/components/BundleSimplePreview'

type DetailedBundleContextData = {
  openedBundle: any
  setOpenedBundle: (bundle: any) => void
  setMined: (mined: boolean) => void
}

const DetailedBundleContext = React.createContext<DetailedBundleContextData>({
  openedBundle: null,
  setOpenedBundle: () => {},
  setMined: () => {}
})

const DetailedBundleProvider = ({ children }: any) => {
  const [openedBundle, setOpenedBundle] = useState<any>(null)
  const [mined, setMined] = useState<any>(false)

  const { sheetRef, openBottomSheet, closeBottomSheet, isOpen } = useBottomSheet()

  useEffect(() => {
    if (openedBundle) {
      openBottomSheet()
    }
  }, [openedBundle])

  console.log(openedBundle)

  return (
    <DetailedBundleContext.Provider
      value={useMemo(
        () => ({
          openedBundle,
          setOpenedBundle,
          setMined
        }),
        [openedBundle]
      )}
    >
      {children}
      <BottomSheet
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={() => {
          closeBottomSheet()
          setOpenedBundle(null)
          setMined(false)
        }}
      >
        <BundleDetailedPreview bundle={openedBundle} mined={mined} />
      </BottomSheet>
    </DetailedBundleContext.Provider>
  )
}

export { DetailedBundleContext, DetailedBundleProvider }
