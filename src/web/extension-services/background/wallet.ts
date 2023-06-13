import { intToHex } from 'ethereumjs-util'

import { NetworkType } from '@common/constants/networks'
import { INTERNAL_REQUEST_ORIGIN } from '@web/constants/common'
import permissionService, {
  ConnectedSite
} from '@web/extension-services/background/services/permission'
import sessionService from '@web/extension-services/background/services/session'

import provider from './provider/provider'
import notificationService from './services/notification'

export class WalletController {
  // TODO: v2
  isUnlocked = () => null

  getConnectedSite = permissionService.getConnectedSite

  requestVaultControllerMethod = (method, props) => {
    // TODO: v2
    // return VaultController[method](props)
  }

  setStorage = (key: string, value: any) => sessionService.broadcastEvent(key, value)

  getCurrentSite = (tabId: number, domain: string): ConnectedSite | null => {
    const { origin, name, icon } = sessionService.getSession(`${tabId}-${domain}`) || {}
    if (!origin) {
      return null
    }
    const site = permissionService.getSite(origin)
    if (site) {
      return site
    }
    return {
      origin,
      name: name!,
      icon: icon!,
      isConnected: false,
      isSigned: false,
      isTop: false
    }
  }

  removeConnectedSite = (origin: ConnectedSite['origin']) => {
    sessionService.broadcastEvent('accountsChanged', [], origin)
    permissionService.removeConnectedSite(origin)
  }

  getConnectedSites = permissionService.getConnectedSites

  activeFirstApproval = () => {
    notificationService.activeFirstApproval()
  }

  getApproval = notificationService.getApproval

  resolveApproval = notificationService.resolveApproval

  rejectApproval = (err?: string, stay = false, isInternal = false) => {
    return notificationService.rejectApproval(err, stay, isInternal)
  }

  networkChange = (network: NetworkType) => {
    sessionService.broadcastEvent('chainChanged', {
      chain: intToHex(network.chainId),
      networkVersion: `${network.chainId}`
    })
  }

  accountChange = (selectedAcc: string) => {
    const account = selectedAcc ? [selectedAcc] : []
    sessionService.broadcastEvent('accountsChanged', account)
  }

  sendRequest = <T = any>(data: any) => {
    return provider<T>({
      data,
      session: {
        name: 'Ambire',
        origin: INTERNAL_REQUEST_ORIGIN,
        icon: '../assets/images/xicon@128.png'
      }
    })
  }
}

export default new WalletController()
