import { networks } from 'ambire-common/src/consts/networks'
import { MainController } from 'ambire-common/src/controllers/main/main'
import { JsonRpcProvider } from 'ethers'

import { areRpcProvidersInitialized, initRpcProviders } from '@common/services/provider'
import { rpcProviders } from '@common/services/providers'
import { RELAYER_URL } from '@env'
import { LedgerControllerMethods } from '@web/extension-services/background/controller-methods/ledgerControllerMethods'
import { MainControllerMethods } from '@web/extension-services/background/controller-methods/mainControllerMethods'
import { WalletControllerMethods } from '@web/extension-services/background/controller-methods/walletControllerMethods'
import providerController from '@web/extension-services/background/provider/provider'
import permissionService from '@web/extension-services/background/services/permission'
import sessionService from '@web/extension-services/background/services/session'
import { storage } from '@web/extension-services/background/webapi/storage'
import eventBus from '@web/extension-services/event/eventBus'
import PortMessage from '@web/extension-services/message/portMessage'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'
import getOriginFromUrl from '@web/utils/getOriginFromUrl'

async function init() {
  // Initialize rpc providers for all networks
  const shouldInitProviders = !areRpcProvidersInitialized()
  if (shouldInitProviders) {
    initRpcProviders(rpcProviders)
  }

  await permissionService.init()
}

init()

const providers = Object.fromEntries(
  networks.map((network) => [network.id, new JsonRpcProvider(network.rpcUrl)])
)

const mainCtrl: MainController = new MainController(storage, fetch, RELAYER_URL)
const ledgerCtrl = new LedgerController()
const trezorCtrl = new TrezorController()
const latticeCtrl = new LatticeController()

// listen for messages from UI
browser.runtime.onConnect.addListener(async (port) => {
  if (port.name === 'popup' || port.name === 'notification' || port.name === 'tab') {
    const pm = new PortMessage(port)
    pm.listen((data: any) => {
      if (data?.type) {
        switch (data.type) {
          case 'broadcast':
            eventBus.emit(data.method, data.params)
            break
          case 'mainControllerMethods': {
            if (data.method) {
              return (
                new MainControllerMethods({
                  mainCtrl,
                  ledgerCtrl,
                  trezorCtrl,
                  latticeCtrl,
                  providers
                }) as any
              )[data.method](...data.params)
            }
            break
          }
          case 'ledgerControllerMethods': {
            if (data.method) {
              return (new LedgerControllerMethods(ledgerCtrl) as any)[data.method](...data.params)
            }
            break
          }
          case 'walletControllerMethods':
          default:
            if (data.method) {
              return (new WalletControllerMethods() as any)[data.method](...data.params)
            }
        }
      }
    })

    const boardcastCallback = (data: any) => {
      pm.request({
        type: 'broadcast',
        method: data.method,
        params: data.params
      })
    }

    if (port.name === 'popup') {
      // TODO:
      // preferenceService.setPopupOpen(true)

      port.onDisconnect.addListener(() => {
        // TODO:
        // preferenceService.setPopupOpen(false)
      })
    }
    eventBus.addEventListener('broadcastToUI', boardcastCallback)
    port.onDisconnect.addListener(() => {
      eventBus.removeEventListener('broadcastToUI', boardcastCallback)
    })
    ;['accountAdder'].forEach((ctrl) => {
      // Broadcast onUpdate for nested controllers
      mainCtrl[ctrl]?.onUpdate(() => {
        pm.request({
          type: 'broadcast',
          method: ctrl,
          params: []
        })
      })
    })

    // Broadcast onUpdate for the main controllers
    mainCtrl.onUpdate(() => {
      pm.request({
        type: 'broadcast',
        method: 'main',
        params: []
      })
    })

    return
  }

  if (!port.sender?.tab) {
    return
  }

  const pm = new PortMessage(port)

  pm.listen(async (data) => {
    // TODO:
    // if (!appStoreLoaded) {
    //   throw ethErrors.provider.disconnected()
    // }

    const sessionId = port.sender?.tab?.id
    if (sessionId === undefined || !port.sender?.url) {
      return
    }

    const origin = getOriginFromUrl(port.sender.url)
    const session = sessionService.getOrCreateSession(sessionId, origin)

    const req = { data, session, origin }
    // for background push to respective page
    req.session!.setPortMessage(pm)

    // Temporarily resolves the subscription methods as successful
    // but the rpc block subscription is actually not implemented because it causes app crashes
    if (data?.method === 'eth_subscribe' || data?.method === 'eth_unsubscribe') {
      return true
    }

    return providerController(req)
  })
})

// On first install, open Ambire Extension in new tab to start the login process
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    const extensionURL = browser.runtime.getURL('tab.html')
    browser.tabs.create({ url: extensionURL })
  }
})
