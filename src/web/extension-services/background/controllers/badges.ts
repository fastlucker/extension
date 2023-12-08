import { MainController } from '@ambire-common/controllers/main/main'
import colors from '@common/styles/colors'
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
      const nonWarningBanners = this.#mainCtrl.banners.filter(
        (banner) => banner.topic !== 'WARNING'
      )

      this.#bannersCount = nonWarningBanners.length
      this.badgesCount = this._badgesCount
    })

    this.#notificationCtrl.onUpdate(() => {
      this.setBadgesCount(this.#notificationCtrl.notificationRequests)
    })
  }

  setBadgesCount = (requests: NotificationRequest[]) => {
    // if not a user request add the badge
    const requestsCount = requests.reduce(
      (accumulator: NotificationRequest[], currentItem: NotificationRequest) => {
        if (!SIGN_METHODS.includes(currentItem?.params?.method)) {
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
      browser.browserAction.setBadgeText({
        text: null
      })
    } else {
      browser.browserAction.setBadgeText({
        text: `${badgesCount}`
      })
      browser.browserAction.setBadgeBackgroundColor({
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
