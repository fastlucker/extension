/* eslint-disable @typescript-eslint/no-shadow */
import { networks } from 'ambire-common/src/consts/networks'
import EventEmitter from 'ambire-common/src/controllers/eventEmitter'
import { MainController } from 'ambire-common/src/controllers/main/main'
import { UserRequest } from 'ambire-common/src/interfaces/userRequest'
import { ethErrors } from 'eth-rpc-errors'
import { EthereumProviderError } from 'eth-rpc-errors/dist/classes'

import { isDev } from '@common/config/env'
import colors from '@common/styles/colors'
import { IS_CHROME, IS_LINUX } from '@web/constants/common'
import { BannersController } from '@web/extension-services/background/controllers/banners'
import userNotification from '@web/extension-services/background/libs/user-notification'
import winMgr, { WINDOW_SIZE } from '@web/extension-services/background/webapi/window'

const QUEUE_REQUESTS_COMPONENTS_WHITELIST = [
  'SendTransaction',
  'SignText',
  'SignTypedData',
  'LedgerHardwareWaiting'
]

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

const isSignAccountOpMethod = (method: string) => {
  return ['eth_sendTransaction', 'gs_multi_send', 'ambire_sendBatchTransaction'].includes(method)
}

const isSignTypedDataMethod = (method: string) => {
  return [
    'eth_signTypedData',
    'eth_signTypedData_v1',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4'
  ].includes(method)
}

const isSignMessageMethod = (method: string) => {
  return ['personal_sign', 'eth_sign'].includes(method)
}

export interface DappNotificationRequest {
  id: number
  screen: string
  winProps?: any
  params?: any
  accountAddr?: string
  networkId?: string
  resolve: (data: any) => void
  reject: (data: any) => void
}

export class NotificationController extends EventEmitter {
  mainCtrl: MainController

  bannersCtrl: BannersController

  _notificationRequests: DappNotificationRequest[] = []

  notificationWindowId: null | number = null

  currentNotificationRequest: DappNotificationRequest | null = null

  selectedAcc: string | null = null

  get notificationRequests() {
    return this._notificationRequests
  }

  set notificationRequests(newValue: DappNotificationRequest[]) {
    this._notificationRequests = newValue

    // Reduce the number because we should count the accountOps not the calls
    const requestsCount = newValue.reduce(
      (accumulator: any, currentItem: DappNotificationRequest) => {
        if (
          isSignAccountOpMethod(currentItem.params?.method) &&
          currentItem.networkId &&
          currentItem.accountAddr
        ) {
          // Check if there's already an item in the accumulator with the same networkId and accountAddr
          const hasDuplicate = accumulator.some(
            (item: DappNotificationRequest) =>
              item.networkId === currentItem.networkId &&
              item.accountAddr === currentItem.accountAddr
          )
          if (!hasDuplicate && currentItem.accountAddr === this.selectedAcc)
            accumulator.push(currentItem)
        } else if (
          currentItem.accountAddr === this.selectedAcc &&
          SIGN_METHODS.includes(currentItem?.params?.method)
        ) {
          accumulator.push(currentItem)
        } else {
          accumulator.push(currentItem)
        }

        return accumulator
      },
      []
    ).length

    if (requestsCount <= 0) {
      browser.browserAction.setBadgeText({
        text: null
      })
    } else {
      browser.browserAction.setBadgeText({
        text: `${requestsCount}`
      })
      browser.browserAction.setBadgeBackgroundColor({
        color: colors.turquoise
      })
    }
  }

  constructor(mainCtrl: MainController, bannersCtrl: BannersController) {
    super()
    this.mainCtrl = mainCtrl
    this.bannersCtrl = bannersCtrl
    winMgr.event.on('windowRemoved', (winId: number) => {
      if (winId === this.notificationWindowId) {
        this.notificationWindowId = null
        this.rejectAllNotificationRequestsThatAreNotSignRequests()
      }
    })

    this.mainCtrl.onUpdate(() => {
      if (this.selectedAcc !== mainCtrl.selectedAccount) {
        this.selectedAcc = mainCtrl.selectedAccount
        this.notificationRequests = [...this.notificationRequests]
      }

      mainCtrl.userRequests.forEach((userReq: UserRequest) => {
        const notificationReq = this.notificationRequests.find((req) => req.id === userReq.id)
        if (!notificationReq) {
          const getScreenType = (kind: UserRequest['action']['kind']) => {
            if (kind === 'call') return 'SendTransaction'
            if (kind === 'message') return 'SignText'
            if (kind === 'typedMessage') return 'SignTypedData'
            return undefined
          }

          const notificationRequestFromUserRequest: DappNotificationRequest = {
            id: userReq.id,
            screen: getScreenType(userReq.action.kind) as string,
            params: {
              method: 'eth_sendTransaction'
            },
            accountAddr: userReq.accountAddr,
            networkId: userReq.networkId,
            resolve: () => {},
            reject: () => {}
          }
          this.notificationRequests = [
            notificationRequestFromUserRequest,
            ...this.notificationRequests
          ]
        }
      })
    })

    winMgr.event.on('windowFocusChange', (winId: number) => {
      // Otherwise, inspecting the notification popup (opening console) is
      // triggering the logic and firing `this.rejectNotificationRequest()` call,
      // which is closing the notification popup, and one can't inspect it.
      if (isDev) return

      if (IS_CHROME && winId === chrome.windows.WINDOW_ID_NONE && IS_LINUX) {
        // When sign on Linux, will focus on -1 first then focus on sign window
        return
      }

      if (this.notificationWindowId !== null && winId !== this.notificationWindowId) {
        if (
          this.currentNotificationRequest &&
          !QUEUE_REQUESTS_COMPONENTS_WHITELIST.includes(this.currentNotificationRequest.screen)
        ) {
          this.rejectNotificationRequest()
        }
      }
    })
  }

  reopenCurrentNotificationRequest = async () => {
    try {
      if (this.notificationRequests.length < 0 || !this.currentNotificationRequest) return
      this.openNotification(this.currentNotificationRequest?.winProps)
    } catch (e: any) {
      this.emitError({
        level: 'major',
        message: 'Request opening failed',
        error: e
      })
    }
  }

  openNotificationRequest = async (notificationId: number) => {
    try {
      const notificationRequest = this.notificationRequests.find((req) => req.id === notificationId)
      if (notificationRequest && !SIGN_METHODS.includes(notificationRequest?.params?.method)) {
        const windows = await browser.windows.getAll()
        const existWindow = windows.find((window) => window.id === this.notificationWindowId)
        if (this.notificationWindowId !== null && !!existWindow) {
          const {
            top: cTop,
            left: cLeft,
            width
          } = await browser.windows.getCurrent({
            windowTypes: ['normal']
          })

          const top = cTop
          const left = cLeft! + width! - WINDOW_SIZE.width
          browser.windows.update(this.notificationWindowId, {
            focused: true,
            top,
            left
          })
          return
        }
      }

      if (this.notificationRequests.length < 0) return

      if (notificationRequest) {
        this.currentNotificationRequest = notificationRequest
        this.emitUpdate()
        this.openNotification(notificationRequest.winProps)
      }
    } catch (e: any) {
      this.emitError({
        level: 'major',
        message: 'Request opening failed',
        error: e
      })
    }
  }

  deleteNotificationRequest = (request: DappNotificationRequest) => {
    if (request && this.notificationRequests.length > 1) {
      this.notificationRequests = this.notificationRequests.filter((item) => request.id !== item.id)
    } else {
      this.currentNotificationRequest = null
      this.notificationRequests = []
    }
  }

  resolveNotificationRequest = async (data: any, requestId?: number) => {
    let notificationRequest = this.currentNotificationRequest

    if (requestId) {
      const notificationRequestById = this.notificationRequests.find((req) => req.id === requestId)
      if (notificationRequestById) notificationRequest = notificationRequestById
    }

    if (notificationRequest) {
      notificationRequest?.resolve(data)

      if (SIGN_METHODS.includes(notificationRequest.params?.method)) {
        this.mainCtrl.removeUserRequest(notificationRequest?.id)
        this.deleteNotificationRequest(notificationRequest)
        this.currentNotificationRequest = null
      } else {
        const currentOrigin = notificationRequest.params?.session?.origin
        this.deleteNotificationRequest(notificationRequest)
        const nextNotificationRequest = this.notificationRequests[0]
        const nextOrigin = nextNotificationRequest.params?.session?.origin

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

  // eslint-disable-next-line default-param-last
  rejectNotificationRequest = async (err: string = 'Request rejected', requestId?: number) => {
    console.log('in reject', requestId)
    let notificationRequest = this.currentNotificationRequest

    if (requestId) {
      const notificationRequestById = this.notificationRequests.find((req) => req.id === requestId)
      if (notificationRequestById) notificationRequest = notificationRequestById
    }

    if (notificationRequest) {
      notificationRequest?.reject &&
        notificationRequest?.reject(ethErrors.provider.userRejectedRequest<any>(err))

      if (SIGN_METHODS.includes(notificationRequest.params?.method)) {
        this.mainCtrl.removeUserRequest(notificationRequest?.id)
        this.deleteNotificationRequest(notificationRequest)
        this.currentNotificationRequest = null
      } else {
        this.deleteNotificationRequest(notificationRequest)
        const nextNotificationRequest = this.notificationRequests[0]
        if (
          nextNotificationRequest &&
          !SIGN_METHODS.includes(nextNotificationRequest?.params?.method)
        ) {
          this.currentNotificationRequest = nextNotificationRequest
        } else this.currentNotificationRequest = null
      }
    }
    this.emitUpdate()
  }

  requestNotificationRequest = async (data: any, winProps?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const id = new Date().getTime()
      const notificationRequest: DappNotificationRequest = {
        id,
        winProps,
        params: data?.params,
        screen: data.screen,
        resolve: (data) => {
          resolve(data)
        },
        reject: (data) => {
          reject(data)
        }
      }

      if (!QUEUE_REQUESTS_COMPONENTS_WHITELIST.includes(data.screen) && this.notificationWindowId) {
        if (this.currentNotificationRequest) {
          throw ethErrors.provider.userRejectedRequest(
            'please request after current request resolve'
          )
        }
      }

      // If account op we add the notification request when we validate the txn params
      if (!isSignAccountOpMethod(notificationRequest.params?.method)) {
        this.notificationRequests = [notificationRequest, ...this.notificationRequests]
      }
      this.currentNotificationRequest = notificationRequest

      if (
        ['wallet_switchEthereumChain', 'wallet_addEthereumChain'].includes(data?.params?.method)
      ) {
        let chainId = data.params?.data?.[0]?.chainId
        if (typeof chainId === 'string') {
          chainId = Number(chainId)
        }

        const network = networks.find((n) => Number(n.chainId) === chainId)
        if (network) {
          this.resolveNotificationRequest(null, notificationRequest.id)
          return
        }
      }
      if (isSignMessageMethod(data?.params?.method)) {
        const request = userNotification.createSignMessageUserRequest({
          id,
          data: data?.params?.data,
          origin: data.params?.session?.origin,
          selectedAccount: this.mainCtrl.selectedAccount || '',
          onError: (err) => this.rejectNotificationRequest(err),
          onSuccess: (data, id) => this.resolveNotificationRequest(data, id)
        })
        if (request) this.mainCtrl.addUserRequest(request)
        else {
          this.rejectNotificationRequest('Invalid request data')
          return
        }
      }

      if (isSignTypedDataMethod(data?.params?.method)) {
        const request = userNotification.createSignTypedDataUserRequest({
          id,
          data: data?.params?.data,
          origin: data.params?.session?.origin,
          selectedAccount: this.mainCtrl.selectedAccount || '',
          onError: (err) => this.rejectNotificationRequest(err),
          onSuccess: (data, id) => this.resolveNotificationRequest(data, id)
        })
        if (request) this.mainCtrl.addUserRequest(request)
        else {
          this.rejectNotificationRequest('Invalid request data')
          return
        }
      }

      if (isSignAccountOpMethod(data?.params?.method)) {
        const txs = data?.params?.data

        Object.keys(txs).forEach((key) => {
          const request = userNotification.createAccountOpUserRequest({
            id,
            txn: txs[key],
            txs,
            origin: data.params?.session?.origin,
            selectedAccount: this.mainCtrl.selectedAccount || '',
            onError: (err) => this.rejectNotificationRequest(err),
            onSuccess: (data, id) => this.resolveNotificationRequest(data, id)
          })
          if (request) {
            this.notificationRequests = [
              {
                ...notificationRequest,
                accountAddr: request.accountAddr,
                networkId: request.networkId
              },
              ...this.notificationRequests
            ]
            this.mainCtrl.addUserRequest(request)
          } else {
            this.notificationRequests = [notificationRequest, ...this.notificationRequests]
            this.rejectNotificationRequest('Invalid request data')
          }
        })
      }

      this.openNotification(notificationRequest.winProps)

      this.emitUpdate()
    })
  }

  clear = async () => {
    this.notificationRequests = []
    this.currentNotificationRequest = null
    if (this.notificationWindowId !== null) {
      try {
        await winMgr.remove(this.notificationWindowId)
      } catch (e) {
        // ignore error
      }
      this.notificationWindowId = null
    }
    this.emitUpdate()
  }

  rejectAllNotificationRequestsThatAreNotSignRequests = () => {
    this.notificationRequests.forEach((notificationReq) => {
      if (!SIGN_METHODS.includes(notificationReq?.params.method)) {
        notificationReq.reject &&
          notificationReq.reject(
            new EthereumProviderError(
              4001,
              `User rejected the request: ${notificationReq?.params.method}`
            )
          )
      }
    })
    this.emitUpdate()
  }

  openNotification = (winProps: any) => {
    if (this.notificationWindowId !== null) {
      winMgr.remove(this.notificationWindowId)
      this.notificationWindowId = null
      this.emitUpdate()
    }
    winMgr.openNotification(winProps).then((winId) => {
      this.notificationWindowId = winId!
      this.emitUpdate()
    })
  }
}
