import { useContext } from 'react'

import { BannerContext } from '@common/contexts/bannerContext'
import { BannerContextReturnType } from '@common/contexts/bannerContext/bannerContext'

function useBanners(): BannerContextReturnType {
  const context = useContext(BannerContext)

  if (!context) {
    throw new Error('useBanner must be used within an BannerContext')
  }

  return context as BannerContextReturnType
}

export default useBanners
