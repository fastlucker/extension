import { useContext } from 'react'

import { BannersContext } from '@common/contexts/bannersContext'
import { BannersContextReturnType } from '@common/contexts/bannersContext/bannersContext'

function useBanners(): BannersContextReturnType {
  const context = useContext(BannersContext)

  if (!context) {
    throw new Error('useBanner must be used within an BannerContext')
  }

  return context as BannersContextReturnType
}

export default useBanners
