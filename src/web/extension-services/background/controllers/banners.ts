import EventEmitter from 'ambire-common/src/controllers/eventEmitter'

export type BannerTopic = 'TRANSACTION' | 'ANNOUNCEMENT' | 'WARNING'

export const BANNER_TOPICS = {
  TRANSACTION: 'TRANSACTION',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  WARNING: 'WARNING'
} as const

export interface Banner {
  id: number
  topic: BannerTopic
  title: string
  text: string
  actions: {
    label: string
    onPress: () => void
    hidesBanner?: boolean
  }[]
}

export class BannersController extends EventEmitter {
  banners: Banner[] = []

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super()
  }

  async addBanner(banner: Banner) {
    if (!banner?.id || this.banners.find((b: Banner) => b.id === banner.id)) return // TODO: here we can emitError

    this.banners = [...this.banners, banner]
    this.emitUpdate()
  }

  removeBanner = async (id: Banner['id']) => {
    if (!this.banners.find((b: Banner) => b.id === id)) return // TODO: here we can emitError

    this.banners = this.banners.filter((b: Banner) => b.id !== id)
    this.emitUpdate()
  }
}
