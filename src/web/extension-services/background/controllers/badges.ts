import { MainController } from '@ambire-common/controllers/main/main'
import { BannerType } from '@ambire-common/interfaces/banner'
import colors from '@common/styles/colors'
import { browser } from '@web/constants/browserapi'
import {
  NotificationController,
  NotificationRequest,
  SIGN_METHODS
} from '@web/extension-services/background/controllers/notification'

export class BadgesController {
  #mainCtrl: MainController

  #notificationCtrl: NotificationController

  #bannersCount: number = 0

  _badgesCount: number = 0

  get badgesCount() {
    return this._badgesCount + this.#bannersCount
  }

  set badgesCount(newValue: number) {
    this._badgesCount = newValue
    this.setBadges(this.badgesCount)
  }

  constructor(mainCtrl: MainController, notificationCtrl: NotificationController) {
    this.#mainCtrl = mainCtrl
    this.#notificationCtrl = notificationCtrl

    this.#mainCtrl.onUpdate(() => {
      const blacklistBadgesForBannersWithId: (number | string)[] = ['keystore-secret-backup']
      const blacklistBadgesForBannersWithType: BannerType[] = ['error', 'warning']

      const banners = this.#mainCtrl?.banners || []
      const infoAndSuccessBanners = banners.filter(
        (banner) =>
          !blacklistBadgesForBannersWithType.includes(banner.type) &&
          !blacklistBadgesForBannersWithId.includes(banner.id)
      )
      this.#bannersCount = infoAndSuccessBanners.length
      this.badgesCount = this._badgesCount
    }, 'badges')

    this.#notificationCtrl.onUpdate(() => {
      this.setBadgesCount(this.#notificationCtrl.notificationRequests)
    })
  }

  setBadgesCount = (requests: NotificationRequest[]) => {
    // if not a user request add the badge
    const requestsCount = requests.reduce(
      (accumulator: NotificationRequest[], currentItem: NotificationRequest) => {
        if (!SIGN_METHODS.includes(currentItem?.method)) {
          accumulator.push(currentItem)
        }

        return accumulator
      },
      []
    ).length

    this.badgesCount = requestsCount
  }

  setBadges = (badgesCount: number) => {
    if (badgesCount <= 0) {
      ;(browser.browserAction || browser.action).setBadgeText({
        text: null
      })
    } else {
      ;(browser.browserAction || browser.action).setBadgeText({
        text: `${badgesCount}`
      })
      ;(browser.browserAction || browser.action).setBadgeBackgroundColor({
        color: colors.turquoise
      })
    }
  }

  toJSON() {
    return {
      ...this,
      badgesCount: this.badgesCount // includes the getter in the stringified instance
    }
  }
}
