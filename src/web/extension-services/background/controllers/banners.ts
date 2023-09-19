import EventEmitter from 'ambire-common/src/controllers/eventEmitter'
import { MainController } from 'ambire-common/src/controllers/main/main'
import { Account } from 'ambire-common/src/interfaces/account'
import { UserRequest } from 'ambire-common/src/interfaces/userRequest'

import { NotificationController } from './notification'

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
  #mainCtrl: MainController

  #notificationCtrl: NotificationController

  _banners: Banner[] = []

  transactionBanners: Banner[] = []

  get banners() {
    return [...this.transactionBanners, ...this._banners]
  }

  set banners(newValue: Banner[]) {
    this._banners = newValue
  }

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(mainCtrl: MainController, notificationCtrl: NotificationController) {
    super()

    this.#mainCtrl = mainCtrl
    this.#notificationCtrl = notificationCtrl

    this.#mainCtrl.onUpdate(() => {
      this.transactionBanners = [
        ...this.getAccountOpBannersForSmartAccountsOnly(),
        ...this.getTransactionBanners()
      ]

      this.emitUpdate()
    })
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

  getTransactionBanners = () => {
    const txnBanners: Banner[] = []

    if (!this.#mainCtrl.userRequests) return txnBanners

    this.#mainCtrl.userRequests.forEach((req: UserRequest) => {
      if (req.accountAddr !== this.#mainCtrl.selectedAccount) return

      if (req.action.kind === 'call') {
        const account =
          this.#mainCtrl.accounts.find((acc) => acc.addr === req.accountAddr) || ({} as Account)
        if (!account?.creation) {
          txnBanners.push({
            id: req.id,
            topic: 'TRANSACTION',
            title: 'Transaction waiting to be signed',
            text: '',
            actions: [
              {
                label: 'Open',
                onPress: () => {
                  this.#notificationCtrl.openNotificationRequest(req.id)
                }
              },
              {
                label: 'Reject',
                onPress: () => {
                  this.#notificationCtrl.rejectNotificationRequest(
                    'User rejected the transaction request',
                    req.id
                  )
                }
              }
            ]
          })
        }
      }
      if (req.action.kind === 'message' || req.action.kind === 'typedMessage') {
        txnBanners.push({
          id: req.id,
          topic: 'TRANSACTION',
          title: 'Message waiting to be signed',
          text: `Message type: ${req.action.kind === 'message' ? 'personal_sign' : 'typed_data'}`,
          actions: [
            {
              label: 'Open',
              onPress: () => {
                this.#notificationCtrl.openNotificationRequest(req.id)
              }
            },
            {
              label: 'Reject',
              onPress: () => {
                this.#notificationCtrl.rejectNotificationRequest(
                  'User rejected the transaction request',
                  req.id
                )
              }
            }
          ]
        })
      }
    })

    return txnBanners
  }

  getAccountOpBannersForSmartAccountsOnly = () => {
    const txnBanners: Banner[] = []

    if (!this.#mainCtrl.userRequests) return txnBanners

    const groupedRequests = this.#mainCtrl.userRequests.reduce(
      (acc: any, userRequest: UserRequest) => {
        const key = `${userRequest.accountAddr}-${userRequest.networkId}`

        if (!acc[key]) {
          acc[key] = []
        }
        const account =
          this.#mainCtrl.accounts.find((a) => a.addr === userRequest.accountAddr) || ({} as Account)
        if (
          userRequest.action.kind === 'call' &&
          account.creation &&
          account.addr === this.#mainCtrl.selectedAccount
        ) {
          acc[key].push(userRequest)
        }

        return acc
      },
      {}
    )

    const groupedRequestsArray: UserRequest[][] = (
      (Object.values(groupedRequests || {}) || []) as UserRequest[][]
    ).filter((group: any) => group.length)

    groupedRequestsArray.forEach((group) => {
      txnBanners.push({
        id: new Date().getTime(),
        topic: 'TRANSACTION',
        title: `${group.length} Transactions waiting to be signed`,
        text: '',
        actions: [
          {
            label: 'Open',
            onPress: () => {
              this.#notificationCtrl.openNotificationRequest(group[0].id)
            }
          },
          {
            label: 'Reject',
            onPress: () => {
              group.forEach((req) => {
                this.#notificationCtrl.rejectNotificationRequest(
                  'User rejected the transaction request',
                  req.id
                )
              })
            }
          }
        ]
      })
    })

    return txnBanners
  }

  toJSON() {
    return {
      ...this,
      banners: this.banners // includes the getter in the stringified instance
    }
  }
}
