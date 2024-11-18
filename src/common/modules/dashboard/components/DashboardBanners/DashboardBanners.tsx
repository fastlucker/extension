import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { Banner } from '@ambire-common/interfaces/banner'
import DashboardBanner from '@common/modules/dashboard/components/DashboardBanners/DashboardBanner/DashboardBanner'
import RPCSelectBottomSheet from '@common/modules/dashboard/components/DashboardBanners/RPCSelectBottomSheet'
import useBanners from '@common/modules/dashboard/hooks/useBanners'

const DashboardBanners = () => {
  const allBanners = useBanners()
  const [bottomSheetBanner, setBottomSheetBanner] = useState<Banner | null>(null)
  const { ref: sheetRef, close: closeBottomSheet } = useModalize()

  const handleSetBottomSheetBanner = useCallback((banner: Banner) => {
    setBottomSheetBanner(banner)
  }, [])

  const handleOnBottomSheetClosed = useCallback(() => {
    setBottomSheetBanner(null)
  }, [])

  return (
    <View>
      {allBanners.map((banner) => (
        <DashboardBanner
          key={banner.id}
          banner={banner}
          setBottomSheetBanner={handleSetBottomSheetBanner}
        />
      ))}

      {!!bottomSheetBanner?.actions?.some((a) => a.actionName === 'select-rpc-url') && (
        <RPCSelectBottomSheet
          banner={bottomSheetBanner}
          sheetRef={sheetRef}
          closeBottomSheet={closeBottomSheet}
          onClosed={handleOnBottomSheetClosed}
        />
      )}
    </View>
  )
}

export default React.memo(DashboardBanners)
