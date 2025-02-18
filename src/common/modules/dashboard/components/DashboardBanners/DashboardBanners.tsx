import React from 'react'
import { View } from 'react-native'

import DashboardBanner from '@common/modules/dashboard/components/DashboardBanners/DashboardBanner/DashboardBanner'
import useBanners from '@common/modules/dashboard/hooks/useBanners'

const DashboardBanners = () => {
  const allBanners = useBanners()

  return (
    <View>
      {allBanners.map((banner) => (
        <DashboardBanner key={banner.id} banner={banner} />
      ))}
    </View>
  )
}

export default React.memo(DashboardBanners)
