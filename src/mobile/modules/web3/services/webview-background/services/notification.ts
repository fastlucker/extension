import networks from 'ambire-common/src/constants/networks'
import { ethErrors } from 'eth-rpc-errors'
import { EthereumProviderError } from 'eth-rpc-errors/dist/classes'
import Events from 'events'
import { v4 as uuidv4 } from 'uuid'

// import { isDev } from '@common/config/env'
// import { BROWSER_EXTENSION_REQUESTS_STORAGE_KEY } from '@common/contexts/extensionApprovalContext/types'
import storage from '../webapi/storage'

export interface Approval {
  id: string
  signingTxId?: string
  data: {
    params?: import('react').ComponentProps<any>['params']
    origin?: string
    approvalComponent: any
    requestDefer?: Promise<any>
    approvalType?: string
  }
  winProps: any
  resolve?(params?: any): void
  reject?(err: EthereumProviderError<any>): void
}

const QUEUE_APPROVAL_COMPONENTS_WHITELIST = [
  'SendTransaction',
  'SignText',
  'SignTypedData',
  'LedgerHardwareWaiting'
]

// something need user approval in window
// should only open one window, unfocus will close the current notification
class NotificationService extends Events {
  currentApproval: Approval | null = null

  _approvals: Approval[] = []

  notifiWindowId: null | number = null

  isLocked = false

  openApprovalModal: (req: any) => void

  constructor({ openApprovalModal }: { openApprovalModal: (req: any) => void }) {
    super()
    this.openApprovalModal = openApprovalModal
  }

  get approvals() {
    return this._approvals
  }

  set approvals(val: Approval[]) {
    this._approvals = val
  }

  activeFirstApproval = async () => {
    try {
      if (this.approvals.length < 0) return

      const approval = this.approvals[0]
      this.currentApproval = approval
      this.openNotification(approval)
    } catch (e) {
      // TODO:
      // Sentry.captureException(`activeFirstApproval failed: ${JSON.stringify(e)}`)
      this.clear()
    }
  }

  deleteApproval = (approval) => {
    if (approval && this.approvals.length > 1) {
      this.approvals = this.approvals.filter((item) => approval.id !== item.id)
    } else {
      this.currentApproval = null
      this.approvals = []
    }
  }

  getApproval = () => this.currentApproval

  resolveApproval = async (data?: any, forceReject = false, approvalId?: string) => {
    if (approvalId && approvalId !== this.currentApproval?.id) return
    if (forceReject) {
      this.currentApproval?.reject &&
        this.currentApproval?.reject(new EthereumProviderError(4001, 'User Cancel'))
    } else {
      this.currentApproval?.resolve && this.currentApproval?.resolve(data)
    }

    const approval = this.currentApproval

    this.deleteApproval(approval)

    if (this.approvals.length > 0) {
      this.currentApproval = this.approvals[0]
    } else {
      this.currentApproval = null
    }

    this.emit('resolve', data)
  }

  rejectApproval = async (err?: string, stay = false, isInternal = false) => {
    const approval = this.currentApproval

    if (this.approvals.length <= 1) {
      await this.clear(stay) // TODO: FIXME
    }

    if (isInternal) {
      approval?.reject && approval?.reject(ethErrors.rpc.internal(err))
    } else {
      approval?.reject && approval?.reject(ethErrors.provider.userRejectedRequest<any>(err))
    }
    if (approval?.data?.approvalComponent === 'SendTransaction') {
      // Removes all cached signing requests (otherwise they will be shown again
      // in the browser extension UI, when it gets opened by the user)
      // TODO: mobile impl
      // browser.storage.local.set({ [BROWSER_EXTENSION_REQUESTS_STORAGE_KEY]: JSON.stringify([]) })
    }

    if (approval && this.approvals.length > 1) {
      this.deleteApproval(approval)
      this.currentApproval = this.approvals[0]
    } else {
      await this.clear(stay)
    }
    this.emit('reject', err)
  }

  requestApproval = async (data, winProps?): Promise<any> => {
    const networkId = await storage.get('networkId')

    return new Promise((resolve, reject) => {
      const uuid = uuidv4()
      let signingTxId

      const approval: Approval = {
        id: uuid,
        signingTxId,
        data,
        winProps,
        resolve(data) {
          resolve(data)
        },
        reject(data) {
          reject(data)
        }
      }

      if (!QUEUE_APPROVAL_COMPONENTS_WHITELIST.includes(data.approvalComponent)) {
        if (this.currentApproval) {
          throw ethErrors.provider.userRejectedRequest(
            'please request after current approval resolve'
          )
        }
      } else if (
        this.currentApproval &&
        !QUEUE_APPROVAL_COMPONENTS_WHITELIST.includes(this.currentApproval.data.approvalComponent)
      ) {
        throw ethErrors.provider.userRejectedRequest(
          'please request after current approval resolve'
        )
      }

      if (data.isUnshift) {
        this.approvals = [approval, ...this.approvals]
        this.currentApproval = approval
      } else {
        this.approvals = [...this.approvals, approval]
        if (!this.currentApproval) {
          this.currentApproval = approval
        }
      }
      // TODO: might be needed for the Multichain UX feature
      if (
        ['wallet_switchEthereumChain', 'wallet_addEthereumChain'].includes(data?.params?.method)
      ) {
        let chainId = data.params?.data?.[0]?.chainId
        if (typeof chainId === 'string') {
          chainId = Number(chainId)
        }

        const network = networks.find((n) => n.chainId === chainId)

        if (network?.id === networkId) {
          this.resolveApproval(null)
          return
        }
      }

      if (this.notifiWindowId !== null) {
        browser.windows.update(this.notifiWindowId, {
          focused: true
        })
      } else {
        this.openNotification(approval)
      }
    })
  }

  clear = async (stay = false) => {
    this.approvals = []
    this.currentApproval = null
    if (this.notifiWindowId !== null && !stay) {
      try {
        await winMgr.remove(this.notifiWindowId)
      } catch (e) {
        // ignore error
      }
      this.notifiWindowId = null
    }
  }

  rejectAllApprovals = () => {
    this.approvals.forEach((approval) => {
      approval.reject &&
        approval.reject(new EthereumProviderError(4001, 'User rejected the request.'))
    })
    this.approvals = []
    this.currentApproval = null

    // Removes all cached signing requests (otherwise they will be shown again
    // in the browser extension UI, when it gets opened by the user)
    // TODO: mobile impl
    // browser.storage.local.set({ [BROWSER_EXTENSION_REQUESTS_STORAGE_KEY]: JSON.stringify([]) })
  }

  unLock = () => {
    this.isLocked = false
  }

  lock = () => {
    this.isLocked = true
  }

  openNotification = (approval) => {
    console.log('open an approval modal in the mobile app')
    if (this.openApprovalModal) {
      this.openApprovalModal(approval.data)
    }
  }
}

export default NotificationService
