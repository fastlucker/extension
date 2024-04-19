import React from 'react'
import { View } from 'react-native'

import useBanners from '@common/modules/dashboard/hooks/useBanners'

import DashboardBanner from './DashboardBanner/DashboardBanner'

const DashboardBanners = () => {
  const allBanners = useBanners()

  return (
    <View>
      {allBanners.map((banner) => (
        <DashboardBanner key={banner.id} {...banner} />
      ))}
    </View>
  )
}

export default DashboardBanners
