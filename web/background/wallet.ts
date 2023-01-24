import permissionService from '@web/background/services/permission'

export class WalletController {
  isUnlocked = () => true

  getConnectedSite = permissionService.getConnectedSite
}

export default new WalletController()
