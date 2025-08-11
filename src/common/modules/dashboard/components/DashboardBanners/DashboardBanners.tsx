import React from 'react'
import { View } from 'react-native'

import DashboardBanner from '@common/modules/dashboard/components/DashboardBanners/DashboardBanner/DashboardBanner'
import MarketingBanner from '@common/modules/dashboard/components/DashboardBanners/MarketingBanner/MarketingBanner'
import useBanners from '@common/modules/dashboard/hooks/useBanners'

const DashboardBanners = () => {
  const [allBanners, marketingBanners] = useBanners()

  return (
    <View>
      {marketingBanners.map((banner) => (
        <MarketingBanner key={banner.id} banner={banner} />
      ))}
      {allBanners.map((banner) => (
        <DashboardBanner key={banner.id} banner={banner} />
      ))}
    </View>
  )
}

export default React.memo(DashboardBanners)
