import VaultController from '@modules/vault/services/VaultController'
import permissionService from '@web/background/services/permission'
import sessionService from '@web/background/services/session'

import notificationService from './services/notification'

export class WalletController {
  isUnlocked = () => true

  getConnectedSite = permissionService.getConnectedSite

  requestVaultControllerMethod = (method, props) => {
    return VaultController[method](props)
  }

  setStorage = (key: string, value: any) => sessionService.broadcastEvent(key, value)

  getApproval = notificationService.getApproval

  resolveApproval = notificationService.resolveApproval

  rejectApproval = (err?: string, stay = false, isInternal = false) => {
    return notificationService.rejectApproval(err, stay, isInternal)
  }
}

export default new WalletController()
