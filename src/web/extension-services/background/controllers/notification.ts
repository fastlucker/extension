/* eslint-disable @typescript-eslint/no-shadow */
import { networks } from 'ambire-common/src/consts/networks'
import { MainController } from 'ambire-common/src/controllers/main/main'
import { DappNotificationRequest } from 'ambire-common/src/interfaces/userRequest'
import { ethErrors } from 'eth-rpc-errors'
import { EthereumProviderError } from 'eth-rpc-errors/dist/classes'
import Events from 'events'

import { isDev } from '@common/config/env'
import generateBigIntId from '@common/utils/generateBigIntId'
import { IS_CHROME, IS_LINUX } from '@web/constants/common'
import { APPROVAL_REQUESTS_STORAGE_KEY } from '@web/contexts/approvalContext/types'
import userNotification from '@web/extension-services/background/libs/user-notification'
import winMgr, { WINDOW_SIZE } from '@web/extension-services/background/webapi/window'

const QUEUE_APPROVAL_COMPONENTS_WHITELIST = [
  'SendTransaction',
  'SignText',
  'SignTypedData',
  'LedgerHardwareWaiting'
]

export class NotificationController extends Events {
  mainCtrl: MainController

  notificationWindowId: null | number = null

  currentDappNotificationRequest: DappNotificationRequest | null = null

  constructor(mainCtrl: MainController) {
    super()
    this.mainCtrl = mainCtrl
    winMgr.event.on('windowRemoved', (winId: number) => {
      if (winId === this.notificationWindowId) {
        this.notificationWindowId = null
        this.rejectAllApprovals()
      }
    })

    winMgr.event.on('windowFocusChange', (winId: number) => {
      // Otherwise, inspecting the notification popup (opening console) is
      // triggering the logic and firing `this.rejectApproval()` call,
      // which is closing the notification popup, and one can't inspect it.
      if (isDev) return

      if (IS_CHROME && winId === chrome.windows.WINDOW_ID_NONE && IS_LINUX) {
        // When sign on Linux, will focus on -1 first then focus on sign window
        return
      }

      if (this.notificationWindowId !== null && winId !== this.notificationWindowId) {
        if (
          this.currentDappNotificationRequest &&
          !QUEUE_APPROVAL_COMPONENTS_WHITELIST.includes(this.currentDappNotificationRequest.screen)
        ) {
          this.rejectApproval()
        }
      }
    })
  }

  activeFirstApproval = async () => {
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

      if (this.mainCtrl.dappsNotificationRequests.length < 0) return

      const notificationRequest = this.mainCtrl.dappsNotificationRequests[0]
      this.currentDappNotificationRequest = notificationRequest
      this.openNotification(notificationRequest.winProps, true)
    } catch (e) {
      this.clear()
    }
  }

  getApproval = () => this.currentDappNotificationRequest

  resolveApproval = async (data: any, approvalId: bigint) => {
    if (approvalId && approvalId !== this.currentDappNotificationRequest?.id) return
    const notificationRequest = this.currentDappNotificationRequest
    this.mainCtrl.resolveDappNotificationRequest(
      data,
      approvalId || (notificationRequest?.id as bigint)
    )

    if (this.mainCtrl.dappsNotificationRequests.length > 0) {
      this.currentDappNotificationRequest = this.mainCtrl.dappsNotificationRequests[0]
    } else {
      this.currentDappNotificationRequest = null
    }

    this.emit('resolve', data)
  }

  // eslint-disable-next-line default-param-last
  rejectApproval = async (err: string = 'Request rejected') => {
    const notificationRequest = this.currentDappNotificationRequest

    this.mainCtrl.rejectDappNotificationRequest(
      ethErrors.provider.userRejectedRequest<any>(err),
      notificationRequest?.id as bigint
    )

    if (notificationRequest && this.mainCtrl.dappsNotificationRequests.length) {
      this.currentDappNotificationRequest = this.mainCtrl.dappsNotificationRequests[0]
    } else {
      await this.clear()
    }
    this.emit('reject', err)
  }

  requestApproval = async (data: any, winProps?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const id = generateBigIntId()
      const notificationRequest: DappNotificationRequest = {
        id,
        winProps,
        session: data.params?.session,
        screen: data.approvalComponent,
        resolve: (data) => {
          resolve(data)
        },
        reject: (data) => {
          reject(data)
        }
      }

      if (!QUEUE_APPROVAL_COMPONENTS_WHITELIST.includes(data.approvalComponent)) {
        if (this.currentDappNotificationRequest) {
          throw ethErrors.provider.userRejectedRequest(
            'please request after current request resolve'
          )
        }
      } else if (
        this.currentDappNotificationRequest &&
        !QUEUE_APPROVAL_COMPONENTS_WHITELIST.includes(this.currentDappNotificationRequest.screen)
      ) {
        throw ethErrors.provider.userRejectedRequest('please request after current request resolve')
      }

      if (data.isUnshift) {
        this.mainCtrl.dappsNotificationRequests = [
          notificationRequest,
          ...this.mainCtrl.dappsNotificationRequests
        ]
        this.currentDappNotificationRequest = notificationRequest
      } else {
        this.mainCtrl.dappsNotificationRequests = [
          ...this.mainCtrl.dappsNotificationRequests,
          notificationRequest
        ]
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
          this.resolveApproval(null, notificationRequest.id)
          return
        }
      }
      if (['personal_sign', 'eth_sign'].includes(data?.params?.method)) {
        const request = userNotification.createSignMessageUserRequest({
          id,
          data: data?.params?.data,
          origin: data.params?.session?.origin,
          selectedAccount: this.mainCtrl.selectedAccount || '',
          onError: (err) => this.rejectApproval(err),
          onSuccess: (data, id) => this.resolveApproval(data, id)
        })
        if (request) this.mainCtrl.addUserRequest(request)
        else {
          this.rejectApproval('Invalid request data')
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
          onError: (err) => this.rejectApproval(err),
          onSuccess: (data, id) => this.resolveApproval(data, id)
        })
        if (request) this.mainCtrl.addUserRequest(request)
        else {
          this.rejectApproval('Invalid request data')
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
            onError: (err) => this.rejectApproval(err),
            onSuccess: (data, id) => this.resolveApproval(data, id)
          })
          if (request) this.mainCtrl.addUserRequest(request)
          else {
            this.rejectApproval('Invalid request data')
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
    })
  }

  clear = async () => {
    this.mainCtrl.dappsNotificationRequests = []
    this.currentDappNotificationRequest = null
    if (this.notificationWindowId !== null) {
      try {
        await winMgr.remove(this.notificationWindowId)
      } catch (e) {
        // ignore error
      }
      this.notificationWindowId = null
    }
  }

  rejectAllApprovals = () => {
    this.mainCtrl.dappsNotificationRequests.forEach((notificationReq) => {
      notificationReq.reject &&
        notificationReq.reject(new EthereumProviderError(4001, 'User rejected the request.'))
    })
    this.mainCtrl.dappsNotificationRequests = []
    this.currentDappNotificationRequest = null

    // Removes all cached signing requests (otherwise they will be shown again
    // in the browser extension UI, when it gets opened by the user)
    browser.storage.local.set({ [APPROVAL_REQUESTS_STORAGE_KEY]: JSON.stringify([]) })
  }

  openNotification = (winProps: any) => {
    if (this.notificationWindowId !== null) {
      winMgr.remove(this.notificationWindowId)
      this.notificationWindowId = null
    }
    winMgr.openNotification(winProps).then((winId) => {
      this.notificationWindowId = winId!
    })
  }
}
