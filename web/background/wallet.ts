import VaultController from '@modules/vault/services/VaultController'
import permissionService, { ConnectedSite } from '@web/background/services/permission'
import sessionService from '@web/background/services/session'

import notificationService from './services/notification'

export class WalletController {
  isUnlocked = () => VaultController.isVaultUnlocked()

  getConnectedSite = permissionService.getConnectedSite

  requestVaultControllerMethod = (method, props) => {
    return VaultController[method](props)
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
      // TODO: Ref from constants
      chain: '0x1',
      isConnected: false,
      isSigned: false,
      isTop: false
    }
  }

  removeConnectedSite = (origin: ConnectedSite['origin']) => {
    sessionService.broadcastEvent('accountsChanged', [], origin)
    permissionService.removeConnectedSite(origin)
  }

  getApproval = notificationService.getApproval

  resolveApproval = notificationService.resolveApproval

  rejectApproval = (err?: string, stay = false, isInternal = false) => {
    return notificationService.rejectApproval(err, stay, isInternal)
  }
}

export default new WalletController()
