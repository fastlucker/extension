import VaultController from '@modules/vault/services/VaultController'
import permissionService from '@web/background/services/permission'
import sessionService from '@web/background/services/session'

export class WalletController {
  isUnlocked = () => true

  getConnectedSite = permissionService.getConnectedSite

  requestVaultControllerMethod = (method, props) => {
    return VaultController[method](props)
  }

  setStorage = (key, value) => {
    // TODO: Wire-up cases like change network

    return sessionService.broadcastEvent(key, value)
  }
}

export default new WalletController()
