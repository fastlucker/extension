import { networks } from 'ambire-common/src/consts/networks'
import { MainController } from 'ambire-common/src/controllers/main/main'
import { KeyIterator } from 'ambire-common/src/libs/keyIterator/keyIterator'
import { JsonRpcProvider } from 'ethers'

import { areRpcProvidersInitialized, initRpcProviders } from '@common/services/provider'
import { rpcProviders } from '@common/services/providers'
import { RELAYER_URL } from '@env'
import { INTERNAL_REQUEST_ORIGIN } from '@web/constants/common'
import providerController from '@web/extension-services/background/provider/provider'
import notificationService from '@web/extension-services/background/services/notification'
import permissionService from '@web/extension-services/background/services/permission'
import sessionService from '@web/extension-services/background/services/session'
import { storage } from '@web/extension-services/background/webapi/storage'
import eventBus from '@web/extension-services/event/eventBus'
import PortMessage from '@web/extension-services/message/portMessage'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'
import LatticeKeyIterator from '@web/modules/hardware-wallet/libs/latticeKeyIterator'
import LedgerKeyIterator from '@web/modules/hardware-wallet/libs/ledgerKeyIterator'
import TrezorKeyIterator from '@web/modules/hardware-wallet/libs/trezorKeyIterator'
import getOriginFromUrl from '@web/utils/getOriginFromUrl'

import { Action } from './actions'
import { controllersMapping } from './types'

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

const mainCtrl = new MainController(storage, fetch, RELAYER_URL)
const ledgerCtrl = new LedgerController()
const trezorCtrl = new TrezorController()
trezorCtrl.init()
const latticeCtrl = new LatticeController()

// listen for messages from UI
browser.runtime.onConnect.addListener(async (port) => {
  if (port.name === 'popup' || port.name === 'notification' || port.name === 'tab') {
    const pm = new PortMessage(port)
    pm.listen(async (data: Action) => {
      if (data?.type) {
        switch (data.type) {
          case 'broadcast':
            eventBus.emit(data.method, data.params)
            break

          case 'INIT_CONTROLLER_STATE': {
            if (data.params.controller === ('main' as any)) {
              pm.request({
                type: 'broadcast',
                method: 'main',
                params: mainCtrl
              })
            } else {
              pm.request({
                type: 'broadcast',
                method: data.params.controller,
                params: (mainCtrl as any)[data.params.controller]
              })
            }
            break
          }
          case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER': {
            const keyIterator = new LedgerKeyIterator({ hdk: ledgerCtrl.hdk, app: ledgerCtrl.app })
            return mainCtrl.accountAdder.init({
              ...data.params,
              keyIterator,
              preselectedAccounts: data.params.preselectedAccounts
            })
          }
          case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR': {
            const keyIterator = new TrezorKeyIterator({ hdk: trezorCtrl.hdk })
            return mainCtrl.accountAdder.init({
              ...data.params,
              keyIterator,
              preselectedAccounts: data.params.preselectedAccounts
            })
          }
          case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE': {
            const keyIterator = new LatticeKeyIterator({
              sdkSession: latticeCtrl.sdkSession,
              getHDPathIndices: latticeCtrl._getHDPathIndices
            })
            return mainCtrl.accountAdder.init({
              ...data.params,
              keyIterator,
              preselectedAccounts: data.params.preselectedAccounts
            })
          }
          case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE': {
            const keyIterator = new KeyIterator(data.params.privKeyOrSeed)
            return mainCtrl.accountAdder.init({
              keyIterator,
              preselectedAccounts: data.params.preselectedAccounts
            })
          }
          case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SELECT_ACCOUNT': {
            return mainCtrl.accountAdder.selectAccount(data.params.account)
          }
          case 'MAIN_CONTROLLER_ACCOUNT_ADDER_DESELECT_ACCOUNT': {
            return mainCtrl.accountAdder.deselectAccount(data.params.account)
          }
          case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE':
            return mainCtrl.accountAdder.setPage({ ...data.params, networks, providers })
          case 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS':
            return mainCtrl.accountAdder.addAccounts(data.params.accounts)

          case 'LEDGER_CONTROLLER_UNLOCK':
            return ledgerCtrl.unlock(data?.params?.hdPath)
          case 'LEDGER_CONTROLLER_GET_PATH_FOR_INDEX':
            return ledgerCtrl._getPathForIndex(data.params)
          case 'LEDGER_CONTROLLER_APP':
            return ledgerCtrl.app
          case 'LEDGER_CONTROLLER_AUTHORIZE_HID_PERMISSION':
            return ledgerCtrl.authorizeHIDPermission()

          case 'TREZOR_CONTROLLER_UNLOCK':
            return trezorCtrl.unlock()

          case 'LATTICE_CONTROLLER_UNLOCK':
            return latticeCtrl.unlock()

          case 'WALLET_CONTROLLER_IS_UNLOCKED':
            return null // TODO: implement in v2
          case 'WALLET_CONTROLLER_GET_CONNECTED_SITE':
            return permissionService.getConnectedSite(data.params.origin)
          case 'WALLET_CONTROLLER_GET_CONNECTED_SITES':
            return permissionService.getConnectedSites()
          case 'WALLET_CONTROLLER_REQUEST_VAULT_CONTROLLER_METHOD':
            return null // TODO: Implement in v2
          case 'WALLET_CONTROLLER_SET_STORAGE':
            return sessionService.broadcastEvent(data.params.key, data.params.value)
          case 'WALLET_CONTROLLER_GET_CURRENT_SITE': {
            const { tabId, domain } = data.params
            const { origin, name, icon } = sessionService.getSession(`${tabId}-${domain}`) || {}
            if (!origin) return null

            const site = permissionService.getSite(origin)
            if (site) return site

            return {
              origin,
              name: name!,
              icon: icon!,
              isConnected: false,
              isSigned: false,
              isTop: false
            }
          }
          case 'WALLET_CONTROLLER_REMOVE_CONNECTED_SITE': {
            sessionService.broadcastEvent('accountsChanged', [], data.params.origin)
            permissionService.removeConnectedSite(data.params.origin)
            break
          }
          case 'WALLET_CONTROLLER_ACTIVE_FIRST_APPROVAL':
            return notificationService.activeFirstApproval()
          case 'WALLET_CONTROLLER_GET_APPROVAL':
            return notificationService.getApproval()
          case 'WALLET_CONTROLLER_RESOLVE_APPROVAL':
            return notificationService.resolveApproval(data.params)
          case 'WALLET_CONTROLLER_REJECT_APPROVAL':
            return notificationService.rejectApproval(
              data.params.err,
              data.params.stay,
              data.params.isInternal
            )
          case 'WALLET_CONTROLLER_NETWORK_CHANGE':
            return sessionService.broadcastEvent('chainChanged', {
              chain: intToHex(data.params.network.chainId),
              networkVersion: `${data.params.network.chainId}`
            })
          case 'WALLET_CONTROLLER_ACCOUNT_CHANGE': {
            const account = data.params.selectedAcc ? [data.params.selectedAcc] : []
            return sessionService.broadcastEvent('accountsChanged', account)
          }
          case 'WALLET_CONTROLLER_SEND_REQUEST':
            return providerController({
              data: data.params.data,
              session: {
                name: 'Ambire',
                origin: INTERNAL_REQUEST_ORIGIN || '',
                icon: '../assets/images/xicon@128.png'
              }
            })

          default:
            return console.error(
              `Dispatched ${data?.type} action, but handler in the extension background process not found!`
            )
        }
      }
    })

    const broadcastCallback = (data: any) => {
      pm.request({
        type: 'broadcast',
        method: data.method,
        params: data.params
      })
    }

    if (port.name === 'tab' || port.name === 'notification') {
      port.onDisconnect.addListener(() => {
        ledgerCtrl.cleanUp()
        trezorCtrl.cleanUp()
      })
    }
    eventBus.addEventListener('broadcastToUI', broadcastCallback)
    port.onDisconnect.addListener(() => {
      eventBus.removeEventListener('broadcastToUI', broadcastCallback)
    })

    Object.keys(controllersMapping).forEach((ctrl: any) => {
      // Broadcast onUpdate for nested controllers
      ;(mainCtrl as any)[ctrl]?.onUpdate(() => {
        pm.request({
          type: 'broadcast',
          method: ctrl,
          params: (mainCtrl as any)[ctrl]
        })
      })
    })

    // Broadcast onUpdate for the main controllers
    mainCtrl.onUpdate(() => {
      pm.request({
        type: 'broadcast',
        method: 'main',
        params: mainCtrl
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
