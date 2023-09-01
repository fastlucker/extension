/* eslint-disable @typescript-eslint/no-shadow */
import { networks } from 'ambire-common/src/consts/networks'
import EventEmitter from 'ambire-common/src/controllers/eventEmitter'
import { MainController } from 'ambire-common/src/controllers/main/main'
import { ethErrors } from 'eth-rpc-errors'
import { EthereumProviderError } from 'eth-rpc-errors/dist/classes'

import { isDev } from '@common/config/env'
import colors from '@common/styles/colors'
import generateBigIntId from '@common/utils/generateBigIntId'
import { IS_CHROME, IS_LINUX } from '@web/constants/common'
import userNotification from '@web/extension-services/background/libs/user-notification'
import winMgr, { WINDOW_SIZE } from '@web/extension-services/background/webapi/window'

const QUEUE_REQUESTS_COMPONENTS_WHITELIST = [
  'SendTransaction',
  'SignText',
  'SignTypedData',
  'LedgerHardwareWaiting'
]

const SIGN_METHODS = [
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

export interface DappNotificationRequest {
  id: bigint
  screen: string
  winProps?: any
  params?: any
  resolve: (data: any) => void
  reject: (data: any) => void
}

export class NotificationController extends EventEmitter {
  mainCtrl: MainController

  _dappsNotificationRequests: DappNotificationRequest[] = []

  notificationWindowId: null | number = null

  currentDappNotificationRequest: DappNotificationRequest | null = null

  get dappsNotificationRequests() {
    return this._dappsNotificationRequests
  }

  set dappsNotificationRequests(newValue: DappNotificationRequest[]) {
    this._dappsNotificationRequests = newValue

    if (newValue.length <= 0) {
      browser.browserAction.setBadgeText({
        text: null
      })
    } else {
      browser.browserAction.setBadgeText({
        text: `${newValue.length}`
      })
      browser.browserAction.setBadgeBackgroundColor({
        color: colors.turquoise
      })
    }
  }

  constructor(mainCtrl: MainController) {
    super()
    this.mainCtrl = mainCtrl
    winMgr.event.on('windowRemoved', (winId: number) => {
      if (winId === this.notificationWindowId) {
        this.notificationWindowId = null
        this.rejectAllNotificationRequests()
      }
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
          this.currentDappNotificationRequest &&
          !QUEUE_REQUESTS_COMPONENTS_WHITELIST.includes(this.currentDappNotificationRequest.screen)
        ) {
          this.rejectNotificationRequest()
        }
      }
    })
  }

  openFirstNotificationRequest = async () => {
    try {
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

      if (this.dappsNotificationRequests.length < 0) return

      const notificationRequest = this.dappsNotificationRequests[0]
      this.currentDappNotificationRequest = notificationRequest
      this.emitUpdate()
      this.openNotification(notificationRequest.winProps)
    } catch (e) {
      this.clear()
    }
  }

  deleteApproval = (request: DappNotificationRequest) => {
    if (request && this.dappsNotificationRequests.length > 1) {
      this.dappsNotificationRequests = this.dappsNotificationRequests.filter(
        (item) => request.id !== item.id
      )
    } else {
      this.currentDappNotificationRequest = null
      this.dappsNotificationRequests = []
    }
  }

  resolveNotificationRequest = async (data: any, requestId?: bigint) => {
    if (requestId && requestId !== this.currentDappNotificationRequest?.id) return
    const notificationRequest = this.currentDappNotificationRequest
    notificationRequest?.resolve(data)

    if (notificationRequest && SIGN_METHODS.includes(notificationRequest?.params.method)) {
      this.mainCtrl.removeUserRequest(notificationRequest?.id)
    }

    this.deleteApproval(notificationRequest as DappNotificationRequest)

    if (this.dappsNotificationRequests.length > 0) {
      this.currentDappNotificationRequest = this.dappsNotificationRequests[0]
    } else {
      this.currentDappNotificationRequest = null
    }

    this.emitUpdate()
  }

  // eslint-disable-next-line default-param-last
  rejectNotificationRequest = async (err: string = 'Request rejected') => {
    const notificationRequest = this.currentDappNotificationRequest

    if (this.dappsNotificationRequests.length <= 1) {
      this.clear() // TODO: FIXME
    }

    notificationRequest?.reject &&
      notificationRequest?.reject(ethErrors.provider.userRejectedRequest<any>(err))

    if (notificationRequest && SIGN_METHODS.includes(notificationRequest?.params.method)) {
      this.mainCtrl.removeUserRequest(notificationRequest?.id)
    }

    if (notificationRequest && this.dappsNotificationRequests.length > 1) {
      this.deleteApproval(notificationRequest)
      this.currentDappNotificationRequest = this.dappsNotificationRequests[0]
    } else {
      await this.clear()
    }

    this.emitUpdate()
  }

  requestNotificationRequest = async (data: any, winProps?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const id = generateBigIntId()
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

      if (!QUEUE_REQUESTS_COMPONENTS_WHITELIST.includes(data.screen)) {
        if (this.currentDappNotificationRequest) {
          throw ethErrors.provider.userRejectedRequest(
            'please request after current request resolve'
          )
        }
      } else if (
        this.currentDappNotificationRequest &&
        !QUEUE_REQUESTS_COMPONENTS_WHITELIST.includes(this.currentDappNotificationRequest.screen)
      ) {
        throw ethErrors.provider.userRejectedRequest('please request after current request resolve')
      }

      if (data.isUnshift) {
        this.dappsNotificationRequests = [notificationRequest, ...this.dappsNotificationRequests]
        this.currentDappNotificationRequest = notificationRequest
      } else {
        this.dappsNotificationRequests = [...this.dappsNotificationRequests, notificationRequest]
        if (!this.currentDappNotificationRequest) {
          this.currentDappNotificationRequest = notificationRequest
        }
      }
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
      if (['personal_sign', 'eth_sign'].includes(data?.params?.method)) {
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

      if (
        [
          'eth_signTypedData',
          'eth_signTypedData_v1',
          'eth_signTypedData_v3',
          'eth_signTypedData_v4'
        ].includes(data?.params?.method)
      ) {
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

      if (
        ['eth_sendTransaction', 'gs_multi_send', 'ambire_sendBatchTransaction'].includes(
          data?.params?.data
        )
      ) {
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
          if (request) this.mainCtrl.addUserRequest(request)
          else {
            this.rejectNotificationRequest('Invalid request data')
          }
        })
      }

      if (this.notificationWindowId !== null) {
        browser.windows.update(this.notificationWindowId, {
          focused: true
        })
      } else {
        this.openNotification(notificationRequest.winProps)
      }
      this.emitUpdate()
    })
  }

  clear = async () => {
    this.dappsNotificationRequests = []
    this.currentDappNotificationRequest = null
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

  rejectAllNotificationRequests = () => {
    this.dappsNotificationRequests.forEach((notificationReq) => {
      if (SIGN_METHODS.includes(notificationReq?.params.method)) {
        this.mainCtrl.removeUserRequest(notificationReq?.id)
      }
      notificationReq.reject &&
        notificationReq.reject(new EthereumProviderError(4001, 'User rejected the request.'))
    })
    this.dappsNotificationRequests = []
    this.currentDappNotificationRequest = null
    this.emitUpdate()
  }

  openNotification = (winProps: any) => {
    if (this.notificationWindowId !== null) {
      winMgr.remove(this.notificationWindowId)
      this.notificationWindowId = null
    }
    winMgr.openNotification(winProps).then((winId) => {
      this.notificationWindowId = winId!
    })
    this.emitUpdate()
  }
}
