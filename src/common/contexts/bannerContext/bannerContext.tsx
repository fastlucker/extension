import React, { createContext, FC, useCallback, useMemo, useState } from 'react'

interface BannerContextReturnType {
  banners: Banner[]
  addBanner: (banner: Banner) => void
}

export const BANNER_TOPICS = ['TRANSACTION', 'ANNOUNCEMENT', 'WARNING']

interface Banner {
  id: string
  topic: typeof BANNER_TOPICS
  title: string
  text: string
  actions: {
    label: string
    onPress: () => void
  }[]
}

interface Props {
  children: React.ReactNode
}

const BannerContext = createContext<BannerContextReturnType | []>([])

const BannerContextProvider: FC<Props> = ({ children }) => {
  const [banners, setBanners] = useState<Banner[]>([])

  const addBanner = useCallback((banner: Banner) => {
    setBanners((prev) => [...prev, banner])
  }, [])

  const contextValue = useMemo(() => ({ banners, addBanner }), [banners, addBanner])

  return <BannerContext.Provider value={contextValue}>{children}</BannerContext.Provider>
}

export default BannerContextProvider

export { BannerContext }
