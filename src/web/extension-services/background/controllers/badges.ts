import { MainController } from 'ambire-common/src/controllers/main/main'

import colors from '@common/styles/colors'
import {
  isSignAccountOpMethod,
  NotificationController,
  NotificationRequest,
  SIGN_METHODS
} from '@web/extension-services/background/controllers/notification'

export class BadgesController {
  #mainCtrl

  #notificationCtrl

  #selectedAcc: string | null = null

  _notificationBadgesCount: number = 0

  get notificationBadgesCount() {
    return this._notificationBadgesCount
  }

  set notificationBadgesCount(newValue: number) {
    this._notificationBadgesCount = newValue
    this.setBadges(this.notificationBadgesCount)
  }

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(mainCtrl: MainController, notificationCtrl: NotificationController) {
    this.#mainCtrl = mainCtrl
    this.#notificationCtrl = notificationCtrl

    this.#mainCtrl.onUpdate(() => {
      if (this.#selectedAcc !== mainCtrl.selectedAccount) {
        this.#selectedAcc = mainCtrl.selectedAccount
      }
    })

    this.#notificationCtrl.onUpdate(() => {
      this.setNotificationBadgesCount(this.#notificationCtrl.notificationRequests)
    })
  }

  setNotificationBadgesCount = (requests: NotificationRequest[]) => {
    console.log('setNotificationBadgesCount', requests)
    // Reduce the number because we should count the accountOps not the calls
    const requestsCount = requests.reduce((accumulator: any, currentItem: NotificationRequest) => {
      if (
        isSignAccountOpMethod(currentItem.params?.method) &&
        currentItem.networkId &&
        currentItem.accountAddr
      ) {
        // Check if there's already an item in the accumulator with the same networkId and accountAddr
        const hasDuplicate = accumulator.some(
          (item: NotificationRequest) =>
            item.networkId === currentItem.networkId && item.accountAddr === currentItem.accountAddr
        )
        if (!hasDuplicate && currentItem.accountAddr === this.#selectedAcc)
          accumulator.push(currentItem)
      } else if (
        currentItem.accountAddr === this.#selectedAcc &&
        SIGN_METHODS.includes(currentItem?.params?.method)
      ) {
        accumulator.push(currentItem)
      } else {
        accumulator.push(currentItem)
      }

      return accumulator
    }, []).length

    this.notificationBadgesCount = requestsCount
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
}
