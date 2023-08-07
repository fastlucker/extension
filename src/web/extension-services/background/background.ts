import { networks } from 'ambire-common/src/consts/networks'
import AccountAdderController from 'ambire-common/src/controllers/accountAdder/accountAdder'
import { MainController } from 'ambire-common/src/controllers/main/main'
import { KeyIterator } from 'ambire-common/src/libs/keyIterator/keyIterator'

import { areRpcProvidersInitialized, initRpcProviders } from '@common/services/provider'
import { rpcProviders } from '@common/services/providers'
import { RELAYER_URL } from '@env'
import { INTERNAL_REQUEST_ORIGIN } from '@web/constants/common'
import provider from '@web/extension-services/background/provider/provider'
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

// eslint-disable-next-line prettier/prettier
// eslint-disable-next-line import/newline-after-import

const controllersMapping = {
  accountAdder: AccountAdderController
  // Add other controllers here:
  // - key is the name of the controller
  // - value is the type of the controller
}

export type ControllersMappingType = {
  [K in keyof typeof controllersMapping]: InstanceType<typeof controllersMapping[K]>
}
;(async () => {
  async function init() {
    // Initialize rpc providers for all networks
    const shouldInitProviders = !areRpcProvidersInitialized()
    if (shouldInitProviders) {
      initRpcProviders(rpcProviders)
    }

    // TODO: remove this it is only for testing the injection
    storage.set('accounts', [
      {
        addr: '0x9188fdd757Df66B4F693D624Ed6A13a15Cf717D7',
        label: '',
        pfp: '',
        associatedKeys: ['0x9188fdd757Df66B4F693D624Ed6A13a15Cf717D7'],
        creation: null
      },
      {
        addr: '0x55E37DE60F709fAb364076b0a21f88a8FFE2C9d0',
        label: '',
        pfp: '',
        associatedKeys: ['0x9188fdd757Df66B4F693D624Ed6A13a15Cf717D7'],
        creation: {
          factoryAddr: '0xF9c2504741f0116f7aff6015b6E210058A8Ac1e4',
          bytecode:
            '0x60017f0349fb5d52df4c24fe33931412aa0bc9dc384b9db02f82da53fa84682c299254553d602d80602e3d3981f3363d3d373d3d3d363d7359ce8fd321090dbf5fd91256b0a11d65d5b689ae5af43d82803e903d91602b57fd5bf3',
          salt: '0x0000000000000000000000000000000000000000000000000000000000000000'
        }
      }
    ])
    await permissionService.init()
  }

  await init()

  const mainCtrl = new MainController(storage, fetch, RELAYER_URL)
  // TODO: remove this it is only for testing the injection
  mainCtrl.selectAccount('0x9188fdd757Df66B4F693D624Ed6A13a15Cf717D7')
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

            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER': {
              const keyIterator = new LedgerKeyIterator({
                hdk: ledgerCtrl.hdk,
                app: ledgerCtrl.app
              })
              return mainCtrl.accountAdder.init({
                ...data.params,
                keyIterator,
                preselectedAccounts: []
              })
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR': {
              const keyIterator = new TrezorKeyIterator({ hdk: trezorCtrl.hdk })
              return mainCtrl.accountAdder.init({
                ...data.params,
                keyIterator,
                preselectedAccounts: []
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
                preselectedAccounts: []
              })
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE': {
              const keyIterator = new KeyIterator(data.params.privKeyOrSeed)
              return mainCtrl.accountAdder.init({ keyIterator, preselectedAccounts: [] })
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SELECT_ACCOUNT': {
              return mainCtrl.accountAdder.selectAccount(data.params.account)
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_DESELECT_ACCOUNT': {
              return mainCtrl.accountAdder.deselectAccount(data.params.account)
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE':
              return mainCtrl.accountAdder.setPage({
                ...data.params,
                networks,
                providers: rpcProviders
              })

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
              return provider({
                data: data.params.data,
                session: {
                  name: 'Ambire',
                  origin: INTERNAL_REQUEST_ORIGIN || '',
                  icon: '../assets/images/xicon@128.png'
                },
                mainCtrl
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

      return provider({ ...req, mainCtrl })
    })
  })

  // On first install, open Ambire Extension in new tab to start the login process
  browser.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
      const extensionURL = browser.runtime.getURL('tab.html')
      browser.tabs.create({ url: extensionURL })
    }
  })
})()
