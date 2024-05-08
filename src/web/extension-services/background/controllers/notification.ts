/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-shadow */
import { ethErrors } from 'eth-rpc-errors'

import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { MainController } from '@ambire-common/controllers/main/main'
import { UserRequest } from '@ambire-common/interfaces/userRequest'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import findAccountOpInSignAccountOpsToBeSigned from '@ambire-common/utils/findAccountOpInSignAccountOpsToBeSigned'
import { delayPromise } from '@common/utils/promises'
import { browser } from '@web/constants/browserapi'
import { DappsController } from '@web/extension-services/background/controllers/dapps'
import { UserNotification } from '@web/extension-services/background/libs/user-notification'
import { ProviderRequest } from '@web/extension-services/background/provider/types'
import winMgr, { WINDOW_SIZE } from '@web/extension-services/background/webapi/window'
import { PortMessenger } from '@web/extension-services/messengers'

const QUEUE_REQUESTS_COMPONENTS_WHITELIST = ['SendTransaction', 'SignText', 'SignTypedData']

export const BENZIN_NOTIFICATION_DATA = { screen: 'Benzin', method: 'benzin' }

export const SIGN_METHODS = [
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
  'personal_sign',
  'eth_sign',
  'eth_sendTransaction',
  'gs_multi_send',
  'ambire_sendBatchTransaction'
]

export const isSignAccountOpMethod = (method: string) => {
  return ['eth_sendTransaction', 'gs_multi_send', 'ambire_sendBatchTransaction'].includes(method)
}

export const isSignTypedDataMethod = (method: string) => {
  return [
    'eth_signTypedData',
    'eth_signTypedData_v1',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4'
  ].includes(method)
}

export const isSignMessageMethod = (method: string) => {
  return ['personal_sign', 'eth_sign'].includes(method)
}

export const getScreenType = (kind: UserRequest['action']['kind']) => {
  if (kind === 'call') return 'SendTransaction'
  if (kind === 'message') return 'SignText'
  if (kind === 'typedMessage') return 'SignTypedData'
  return undefined
}

export const getAccountOpId = (accountOp: AccountOp) => {
  return `${accountOp.accountAddr}-${accountOp.networkId}`
}

type Request = ProviderRequest & {
  screen: string
  meta?: { [key: string]: any }
}

export type NotificationRequest = Request & { id: string }

export type NotificationRequestPromises = {
  id: string
  resolve: (data: any) => void
  reject: (data: any) => void
}

export class NotificationController extends EventEmitter {
  #mainCtrl: MainController

  #dappsCtrl: DappsController

  #pm: PortMessenger

  notificationRequests: NotificationRequest[] = []

  notificationRequestPromises: NotificationRequestPromises[] = []

  notificationWindowId: null | number = null

  currentNotificationRequest: NotificationRequest | null = null

  constructor(mainCtrl: MainController, dappsCtrl: DappsController, pm: PortMessenger) {
    super()
    this.#mainCtrl = mainCtrl
    this.#dappsCtrl = dappsCtrl
    this.#pm = pm
    winMgr.event.on('windowRemoved', (winId: number) => {
      if (winId === this.notificationWindowId) {
        this.notificationWindowId = null
        this.notifyForClosedUserRequestThatAreStillPending()
        this.rejectAllNotificationRequestsThatAreNotSignRequests()
      }
    })

    this.#mainCtrl.onUpdate(() => {
      const notificationRequestsToAdd: NotificationRequest[] = []
      Object.values(this.#mainCtrl.accountOpsToBeSigned).forEach(
        (accountOpsToBeSignedByNetwork) => {
          if (accountOpsToBeSignedByNetwork) {
            Object.values(accountOpsToBeSignedByNetwork).forEach((op) => {
              if (op?.accountOp) {
                const notificationReq = this.notificationRequests.find(
                  (req) => req.id === getAccountOpId(op.accountOp)
                )
                const notificationRequestFromUserRequest: NotificationRequest = {
                  id: getAccountOpId(op.accountOp),
                  screen: 'SendTransaction',
                  method: 'eth_sendTransaction',
                  session: { origin, name: '', icon: '' } as ProviderRequest['session'],
                  origin,
                  meta: {
                    accountAddr: op.accountOp.accountAddr,
                    networkId: op.accountOp.networkId
                  },
                  resolve: () => {},
                  reject: () => {}
                }

                const notificationRequestPromise = this.notificationRequestPromises.find(
                  (r) => r.id === notificationRequestFromUserRequest.id
                )
                if (notificationRequestPromise) {
                  this.notificationRequestPromises = this.notificationRequestPromises.filter(
                    (r) => r.id !== notificationRequestFromUserRequest.id
                  )
                  notificationRequestsToAdd.push({
                    ...notificationRequestFromUserRequest,
                    reject: notificationRequestPromise.reject,
                    resolve: notificationRequestPromise.resolve
                  })
                } else if (!notificationReq) {
                  notificationRequestsToAdd.push(notificationRequestFromUserRequest)
                }
              }
            })
          }
        }
      )
      if (notificationRequestsToAdd.length) {
        this.notificationRequests = [...notificationRequestsToAdd, ...this.notificationRequests]
        this.openNotificationRequest(this.notificationRequests[0].id)
      }

      this.notificationRequests.forEach((req) => {
        if (isSignAccountOpMethod(req.method)) {
          if (
            !findAccountOpInSignAccountOpsToBeSigned(
              this.#mainCtrl.accountOpsToBeSigned,
              req.meta?.accountAddr,
              req.meta?.networkId
            )
          ) {
            this.deleteNotificationRequest(req)
          }
        }
      })

      if (
        SIGN_METHODS.includes(this.currentNotificationRequest?.method as string) &&
        !this.notificationRequests.find((r) => r.id === this.currentNotificationRequest?.id)
      ) {
        const nextNotificationRequest = this.notificationRequests[0]
        if (nextNotificationRequest && !SIGN_METHODS.includes(nextNotificationRequest.method)) {
          this.currentNotificationRequest = nextNotificationRequest
        } else this.currentNotificationRequest = null
      }
    }, 'notification')
  }

  focusCurrentNotificationWindow = () => {
    if (
      !this.notificationRequests.length ||
      !this.currentNotificationRequest ||
      !this.notificationWindowId
    )
      return

    winMgr.focusNotificationWindow(this.notificationWindowId)
    this.#pm.send('> ui-warning', {
      method: 'notification',
      params: {
        warnings: ['Please resolve your pending request first.'],
        controller: 'notification'
      }
    })
  }

  openNotificationRequest = async (notificationId: string) => {
    if (this.currentNotificationRequest?.params?.method === BENZIN_NOTIFICATION_DATA.method) {
      this.deleteNotificationRequest(this.currentNotificationRequest)
      this.currentNotificationRequest = null
    }
    try {
      const notificationRequest = this.notificationRequests.find((req) => req.id === notificationId)
      if (notificationRequest && !SIGN_METHODS.includes(notificationRequest?.params?.method)) {
        const windows = await browser.windows.getAll()
        const existWindow = windows.find((window: any) => window.id === this.notificationWindowId)
        if (this.notificationWindowId !== null && !!existWindow) {
          const {
            top: cTop,
            left: cLeft,
            width
          } = await browser.windows.getCurrent({ windowTypes: ['normal'] })

          const top = cTop
          const left = cLeft! + width! - WINDOW_SIZE.width
          browser.windows.update(this.notificationWindowId, { focused: true, top, left })
          return
        }
      }

      if (this.notificationRequests.length < 0) return

      if (notificationRequest) {
        this.currentNotificationRequest = notificationRequest
        this.emitUpdate()
        this.openNotification()
      }
    } catch (e: any) {
      this.emitError({ level: 'major', message: 'Request opening failed', error: e })
    }
  }

  deleteNotificationRequest = (request: NotificationRequest) => {
    if (request && this.notificationRequests.length) {
      this.notificationRequests = this.notificationRequests.filter((item) => request.id !== item.id)
    } else {
      this.currentNotificationRequest = null
    }
  }

  requestNotificationRequest = (request: Request, openNewWindow: boolean = true): Promise<any> => {
    // Delete the current notification request if it's a benzin request
    if (this.currentNotificationRequest?.method === BENZIN_NOTIFICATION_DATA.method) {
      this.deleteNotificationRequest(this.currentNotificationRequest)
      this.currentNotificationRequest = null
    }

    return new Promise((resolve, reject) => {
      const id = new Date().getTime().toString()
      const notificationRequest: NotificationRequest = { ...request, id }
      const notificationRequestPromise = {
        id,
        resolve: (data: any) => {
          resolve(data)
        },
        reject: (data: any) => {
          reject(data)
        }
      }

      if (
        !QUEUE_REQUESTS_COMPONENTS_WHITELIST.includes(request.screen) &&
        this.notificationWindowId &&
        this.currentNotificationRequest
      ) {
        if (request.screen === this.currentNotificationRequest.screen) {
          this.currentNotificationRequest?.reject(ethErrors.provider.userRejectedRequest<any>())
          this.deleteNotificationRequest(this.currentNotificationRequest)
        } else {
          winMgr.focusNotificationWindow(this.notificationWindowId)
          this.#pm.send('> ui-warning', {
            method: 'notification',
            params: {
              warnings: [
                'You currently have a pending dApp request. Please resolve it before making another request.'
              ],
              controller: 'notification'
            }
          })
          throw ethErrors.provider.userRejectedRequest(
            'please request after current request resolve'
          )
        }
      }

      if (
        ['wallet_switchEthereumChain', 'wallet_addEthereumChain'].includes(
          notificationRequest.method
        )
      ) {
        let chainId = request.params?.[0]?.chainId
        if (typeof chainId === 'string') {
          chainId = Number(chainId)
        }

        const network = this.#mainCtrl.settings.networks.find((n) => Number(n.chainId) === chainId)

        if (network) {
          this.resolveNotificationRequest(null, notificationRequest.id)
          return
        }
      }
      if (isSignMessageMethod(notificationRequest.method)) {
        const userNotification = new UserNotification(this.#dappsCtrl)
        const userRequest = userNotification.createSignMessageUserRequest({
          id,
          data: request.params,
          origin: request.origin,
          selectedAccount: this.#mainCtrl.selectedAccount || '',
          networks: this.#mainCtrl.settings.networks,
          onError: (err) => this.rejectNotificationRequest(err),
          onSuccess: (data, id) => this.resolveNotificationRequest(data, id)
        })
        if (userRequest) this.#mainCtrl.addUserRequest(userRequest)
        else {
          this.rejectNotificationRequest('Invalid request data')
          return
        }
      }

      if (isSignTypedDataMethod(notificationRequest.method)) {
        const userNotification = new UserNotification(this.#dappsCtrl)
        const userRequest = userNotification.createSignTypedDataUserRequest({
          id,
          data: request.params,
          origin: request.origin,
          selectedAccount: this.#mainCtrl.selectedAccount || '',
          networks: this.#mainCtrl.settings.networks,
          onError: (err) => this.rejectNotificationRequest(err),
          onSuccess: (data, id) => this.resolveNotificationRequest(data, id)
        })
        if (userRequest) this.#mainCtrl.addUserRequest(userRequest)
        else {
          this.rejectNotificationRequest('Invalid request data')
          return
        }
      }

      if (isSignAccountOpMethod(notificationRequest.method)) {
        const txs = request.params
        Object.keys(txs).forEach((key) => {
          const userNotification = new UserNotification(this.#dappsCtrl)
          const userRequest = userNotification.createAccountOpUserRequest({
            id: new Date().getTime(),
            txn: txs[key],
            txs,
            origin: request.origin,
            selectedAccount: this.#mainCtrl.selectedAccount || '',
            networks: this.#mainCtrl.settings.networks,
            onError: (err) => this.rejectNotificationRequest(err)
          })
          if (userRequest) {
            this.#mainCtrl.addUserRequest(userRequest)
            this.notificationRequestPromises.push({
              id: `${userRequest.accountAddr}-${userRequest.networkId}`,
              reject: notificationRequest.reject,
              resolve: notificationRequest.resolve
            })
          }
        })
      }

      if (!SIGN_METHODS.includes(notificationRequest.method)) {
        this.notificationRequests = [notificationRequest, ...this.notificationRequests]
        this.currentNotificationRequest = notificationRequest
        this.emitUpdate()
        if (openNewWindow) this.openNotification()
      }
    })
  }

  resolveNotificationRequest = (data: any, requestId?: string) => {
    let notificationRequest = this.currentNotificationRequest

    if (requestId) {
      const notificationRequestById = this.notificationRequests.find((req) => req.id === requestId)
      if (notificationRequestById) notificationRequest = notificationRequestById
    }

    if (notificationRequest) {
      notificationRequest.resolve(data)

      if (SIGN_METHODS.includes(notificationRequest.method)) {
        this.#mainCtrl.removeUserRequest(notificationRequest.id)
        this.deleteNotificationRequest(notificationRequest)
        this.currentNotificationRequest = null
        if (isSignAccountOpMethod(notificationRequest.method) && data?.hash && data?.networkId) {
          const meta = { ...notificationRequest.meta, txnId: null, userOpHash: null }
          data?.isUserOp ? (meta.userOpHash = data.hash) : (meta.txnId = data.hash)
          this.requestNotificationRequest(
            {
              ...notificationRequest,
              screen: BENZIN_NOTIFICATION_DATA.screen,
              method: BENZIN_NOTIFICATION_DATA.method,
              meta
            },
            false
          )

          return
        }
      } else {
        const currentOrigin = notificationRequest?.origin
        this.deleteNotificationRequest(notificationRequest)
        const nextNotificationRequest = this.notificationRequests[0]
        const nextOrigin = nextNotificationRequest?.origin

        const shouldOpenNextRequest =
          (nextNotificationRequest &&
            !SIGN_METHODS.includes(nextNotificationRequest?.params?.method)) ||
          (nextNotificationRequest && currentOrigin && nextOrigin && currentOrigin === nextOrigin)

        if (shouldOpenNextRequest) {
          this.currentNotificationRequest = nextNotificationRequest
        } else this.currentNotificationRequest = null
      }
    }
    this.emitUpdate()
  }

  rejectNotificationRequest = async (err: string, requestId?: string) => {
    let notificationRequest = this.currentNotificationRequest

    if (requestId) {
      const notificationRequestById = this.notificationRequests.find((req) => req.id === requestId)
      if (notificationRequestById) notificationRequest = notificationRequestById
    }

    if (notificationRequest) {
      this.#rejectRequestPromise(err, notificationRequest.id)

      if (isSignAccountOpMethod(notificationRequest.method)) {
        const accountOp = findAccountOpInSignAccountOpsToBeSigned(
          this.#mainCtrl.accountOpsToBeSigned,
          notificationRequest.meta?.accountAddr,
          notificationRequest.meta?.networkId
        )

        if (accountOp)
          this.#mainCtrl.removeAccountOp(
            notificationRequest.meta?.accountAddr,
            notificationRequest.meta?.networkId
          )
      } else {
        this.deleteNotificationRequest(notificationRequest)
        const nextNotificationRequest = this.notificationRequests[0]
        if (nextNotificationRequest && !SIGN_METHODS.includes(nextNotificationRequest.method)) {
          this.currentNotificationRequest = nextNotificationRequest
        } else this.currentNotificationRequest = null
      }
    }

    this.emitUpdate()
  }

  #rejectRequestPromise(err: string, requestId: string) {
    this.notificationRequestPromises.forEach((r) => {
      if (r.id === requestId) {
        r.reject(ethErrors.provider.userRejectedRequest<any>(err || 'Request rejected'))
      }
    })
    this.notificationRequestPromises = this.notificationRequestPromises.filter(
      (r) => r.id !== requestId
    )
  }

  rejectAllNotificationRequestsThatAreNotSignRequests = () => {
    this.notificationRequests.forEach((notificationReq: NotificationRequest) => {
      if (!SIGN_METHODS.includes(notificationReq.method)) {
        this.rejectNotificationRequest(
          `User rejected the request: ${notificationReq.method}`,
          notificationReq.id
        )
      }
    })
    this.emitUpdate()
  }

  notifyForClosedUserRequestThatAreStillPending = async () => {
    if (
      this.currentNotificationRequest &&
      SIGN_METHODS.includes(this.currentNotificationRequest.method)
    ) {
      const title = isSignAccountOpMethod(this.currentNotificationRequest.method)
        ? 'Added Pending Transaction Request'
        : 'Added Pending Message Request'
      const message = isSignAccountOpMethod(this.currentNotificationRequest.method)
        ? 'Transaction added to your cart. You can add more transactions and sign them all together (thus saving on network fees).'
        : 'The message was added to your cart. You can find all pending requests listed on your Dashboard.'

      const id = new Date().getTime()
      // service_worker (mv3) - without await the notification doesn't show
      await browser.notifications.create(id.toString(), {
        type: 'basic',
        iconUrl: browser.runtime.getURL('assets/images/xicon@96.png'),
        title,
        message,
        priority: 2
      })
    }
  }

  openNotification = async () => {
    // Open on next tick to ensure that state update is emitted to FE before opening the window
    await delayPromise(1)
    if (this.notificationWindowId !== null) {
      winMgr.remove(this.notificationWindowId)
      this.notificationWindowId = null
      this.emitUpdate()
    }
    winMgr.openNotification().then((winId) => {
      this.notificationWindowId = winId!
      this.emitUpdate()
    })
  }

  toJSON() {
    return {
      ...this,
      ...super.toJSON(),
      notificationRequests: this.notificationRequests // includes the getter in the stringified instance
    }
  }
}
