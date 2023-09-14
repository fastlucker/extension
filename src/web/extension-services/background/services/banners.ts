import { storage } from '../webapi/storage'

export type BannerTopic = 'TRANSACTION' | 'ANNOUNCEMENT' | 'WARNING'

export const BANNER_TOPICS = {
  TRANSACTION: 'TRANSACTION',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  WARNING: 'WARNING'
} as const

export interface Banner {
  id: number // timestamp
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

export const addBanner = async (banner: Banner, banners?: Banner[]) => {
  const savedBanners = banners || (await storage.get('banners', []))

  if (!banner?.id || savedBanners.find((b: Banner) => b.id === banner.id)) return

  const updatedBanners = [...savedBanners, banner]
  await storage.set('banners', updatedBanners)

  return updatedBanners
}

export const removeBanner = async (id: Banner['id'], banners?: Banner[]) => {
  const savedBanners = banners || (await storage.get('banners', []))

  if (!savedBanners.find((b: Banner) => b.id === id)) return

  const updatedBanners = savedBanners.filter((b: Banner) => b.id !== id)
  await storage.set('banners', updatedBanners)

  return updatedBanners
}
