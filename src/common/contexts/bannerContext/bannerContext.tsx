import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react'

import storage from '@web/extension-services/background/webapi/storage'

export interface BannerContextReturnType {
  banners: Banner[]
  addBanner: (banner: Banner) => void
  removeBanner: (id: string) => void
}

export type BannerTopic = 'TRANSACTION' | 'ANNOUNCEMENT' | 'WARNING'

export const BANNER_TOPICS = {
  TRANSACTION: 'TRANSACTION',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  WARNING: 'WARNING'
} as const

interface Banner {
  id: string
  topic: BannerTopic
  title: string
  text: string
  isHideBtnShown?: boolean
  actions: {
    label: string
    onPress: () => void
    hidesBanner?: boolean
  }[]
}

interface Props {
  children: React.ReactNode
}

const BannerContext = createContext<BannerContextReturnType | []>([])

const BannerProvider: FC<Props> = ({ children }) => {
  const [banners, setBanners] = useState<Banner[]>([])

  useEffect(() => {
    ;(async () => {
      // @TODO: We may want to add a key to each banner that indicates if a banner should persist on reload or not.
      const savedBanners = await storage.get('banners')

      if (savedBanners) {
        setBanners(savedBanners)
      }
    })()
  }, [])

  const addBanner = useCallback(
    async (banner: Banner) => {
      if (!banner?.id || banners.find((b) => b.id === banner.id))
        throw new Error('Banner already exists')

      await storage.set('banners', [...banners, banner])
      setBanners((prev) => [...prev, banner])
    },
    [banners]
  )

  const removeBanner = useCallback(
    async (id: string) => {
      if (!banners.find((banner) => banner.id === id)) throw new Error('Failed to remove banner.')

      await storage.set(
        'banners',
        banners.filter((banner) => banner.id !== id)
      )
      setBanners((prev) => {
        return prev.filter((banner) => banner.id !== id)
      })
    },
    [banners]
  )

  const contextValue = useMemo(
    () => ({ banners, addBanner, removeBanner }),
    [banners, addBanner, removeBanner]
  )

  return <BannerContext.Provider value={contextValue}>{children}</BannerContext.Provider>
}

export { BannerContext, BannerProvider }
