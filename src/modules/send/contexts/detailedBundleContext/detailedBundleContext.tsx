import React, { useEffect, useMemo, useState } from 'react'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@modules/common/components/BottomSheet'
import BundleDetailedPreview from '@modules/transactions/components/BundleDetailedPreview'

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

const DetailedBundleProvider = ({ children, feeAssets }: any) => {
  const [openedBundle, setOpenedBundle] = useState<any>(null)
  const [mined, setMined] = useState<any>(false)

  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  useEffect(() => {
    if (openedBundle) {
      openBottomSheet()
    }
  }, [openedBundle])

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
        id="transactions"
        sheetRef={sheetRef}
        closeBottomSheet={() => {
          closeBottomSheet()
          setOpenedBundle(null)
          setMined(false)
        }}
      >
        <BundleDetailedPreview bundle={openedBundle} mined={mined} feeAssets={feeAssets} />
      </BottomSheet>
    </DetailedBundleContext.Provider>
  )
}

export { DetailedBundleContext, DetailedBundleProvider }
