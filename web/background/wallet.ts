import permissionService from '@web/background/services/permission'
import sessionService from '@web/background/services/session'

export class WalletController {
  isUnlocked = () => true

  getConnectedSite = permissionService.getConnectedSite

  requestVaultControllerMethod = (method, props, options) => {
    // TODO: Fire vault controller singleton methods
    return this.vault[method](props, options)
  }

  setStorage = (key, value) => {
    // TODO: Wire-up cases like change network

    return sessionService.broadcastEvent(key, value)
  }
}

export default new WalletController()
