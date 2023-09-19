import colors from '@common/styles/colors'
import {
  NotificationController,
  NotificationRequest,
  SIGN_METHODS
} from '@web/extension-services/background/controllers/notification'

import { BannersController } from './banners'

export class BadgesController {
  #notificationCtrl: NotificationController

  #bannersCtrl: BannersController

  #bannersCount: number = 0

  _badgesCount: number = 0

  get badgesCount() {
    return this._badgesCount + this.#bannersCtrl.banners.length
  }

  set badgesCount(newValue: number) {
    this._badgesCount = newValue
    this.setBadges(this.badgesCount)
  }

  constructor(notificationCtrl: NotificationController, bannersCtrl: BannersController) {
    this.#notificationCtrl = notificationCtrl
    this.#bannersCtrl = bannersCtrl

    this.#notificationCtrl.onUpdate(() => {
      this.setBadgesCount(this.#notificationCtrl.notificationRequests)
    })

    this.#bannersCtrl.onUpdate(() => {
      this.#bannersCount = this.#bannersCtrl.banners.length
      this.badgesCount = this._badgesCount
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
