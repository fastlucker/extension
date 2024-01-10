/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
import 'setImmediate'

import {
  BIP44_LEDGER_DERIVATION_TEMPLATE,
  BIP44_STANDARD_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import humanizerJSON from '@ambire-common/consts/humanizerInfo.json'
import { networks } from '@ambire-common/consts/networks'
import { MainController } from '@ambire-common/controllers/main/main'
import { ExternalKey } from '@ambire-common/interfaces/keystore'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import { parse, stringify } from '@ambire-common/libs/bigintJson/bigintJson'
import { KeyIterator } from '@ambire-common/libs/keyIterator/keyIterator'
import { KeystoreSigner } from '@ambire-common/libs/keystoreSigner/keystoreSigner'
import { getNetworksWithFailedRPC } from '@ambire-common/libs/settings/settings'
import { areRpcProvidersInitialized, initRpcProviders } from '@ambire-common/services/provider'
import { pinnedTokens } from '@common/constants/tokens'
import { rpcProviders } from '@common/services/providers'
import { RELAYER_URL } from '@env'
import { browser, isManifestV3 } from '@web/constants/browserapi'
import { BadgesController } from '@web/extension-services/background/controllers/badges'
import { NotificationController } from '@web/extension-services/background/controllers/notification'
import provider from '@web/extension-services/background/provider/provider'
import permissionService from '@web/extension-services/background/services/permission'
import sessionService from '@web/extension-services/background/services/session'
import { storage } from '@web/extension-services/background/webapi/storage'
import eventBus from '@web/extension-services/event/eventBus'
import PortMessage from '@web/extension-services/message/portMessage'
import { getPreselectedAccounts } from '@web/modules/account-adder/helpers/account'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'
import LatticeKeyIterator from '@web/modules/hardware-wallet/libs/latticeKeyIterator'
import LatticeSigner from '@web/modules/hardware-wallet/libs/LatticeSigner'
import LedgerKeyIterator from '@web/modules/hardware-wallet/libs/ledgerKeyIterator'
import LedgerSigner from '@web/modules/hardware-wallet/libs/LedgerSigner'
import TrezorKeyIterator from '@web/modules/hardware-wallet/libs/trezorKeyIterator'
import TrezorSigner from '@web/modules/hardware-wallet/libs/TrezorSigner'
import getOriginFromUrl from '@web/utils/getOriginFromUrl'
import { logInfoWithPrefix } from '@web/utils/logger'

import { Action } from './actions'
import { controllersNestedInMainMapping } from './types'

function saveTimestamp() {
  const timestamp = new Date().toISOString()

  browser.storage.session.set({ timestamp })
}

async function init() {
  // Initialize rpc providers for all networks
  // @TODO: get rid of this and use the rpc providers from the settings controller
  const shouldInitProviders = !areRpcProvidersInitialized()
  if (shouldInitProviders) {
    initRpcProviders(rpcProviders)
  }

  // Initialize humanizer in storage
  const humanizerMetaInStorage = await storage.get('HumanizerMeta', {})
  if (Object.keys(humanizerMetaInStorage).length < Object.keys(humanizerJSON).length) {
    await storage.set('HumanizerMeta', humanizerJSON)
  }

  await permissionService.init()
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  if (isManifestV3) {
    // Save the timestamp immediately and then every `SAVE_TIMESTAMP_INTERVAL`
    // miliseconds. This keeps the service worker alive.
    const SAVE_TIMESTAMP_INTERVAL_MS = 2 * 1000

    saveTimestamp()
    setInterval(saveTimestamp, SAVE_TIMESTAMP_INTERVAL_MS)
  }
  await init()
  const portMessageUIRefs: { [key: string]: PortMessage } = {}
  let onResoleDappNotificationRequest: (data: any, id?: number) => void
  let onRejectDappNotificationRequest: (data: any, id?: number) => void

  const ledgerCtrl = new LedgerController()
  const trezorCtrl = new TrezorController()
  const latticeCtrl = new LatticeController()
  const mainCtrl = new MainController({
    storage,
    // popup pages dont have access to fetch. Error: Failed to execute 'fetch' on 'Window': Illegal invocation
    // binding window to fetch provides the correct context
    fetch: isManifestV3 ? fetch : window.fetch.bind(window),
    relayerUrl: RELAYER_URL,
    keystoreSigners: {
      internal: KeystoreSigner,
      // TODO: there is a mismatch in hw signer types, it's not a big deal
      ledger: LedgerSigner,
      trezor: TrezorSigner,
      lattice: LatticeSigner
    },
    externalSignerControllers: {
      ledger: ledgerCtrl,
      trezor: trezorCtrl,
      lattice: latticeCtrl
    },
    onResolveDappRequest: (data, id) => {
      !!onResoleDappNotificationRequest && onResoleDappNotificationRequest(data, id)
    },
    onRejectDappRequest: (err, id) => {
      !!onRejectDappNotificationRequest && onRejectDappNotificationRequest(err, id)
    },
    onUpdateDappSelectedAccount: (accountAddr) => {
      const account = accountAddr ? [accountAddr] : []
      return sessionService.broadcastEvent('accountsChanged', account)
    },
    onBroadcastSuccess: (type: 'message' | 'typed-data' | 'account-op') => {
      notifyForSuccessfulBroadcast(type)
      setAccountStateInterval(accountStateIntervals.pending)
    },
    pinned: pinnedTokens
  })
  const notificationCtrl = new NotificationController(mainCtrl)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const badgesCtrl = new BadgesController(mainCtrl, notificationCtrl)

  let fetchPortfolioIntervalId: any
  /** ctrlOnUpdateIsDirtyFlags will be set to true for a given ctrl
  when it receives an update in the ctrl.onUpdate callback. While the flag is truthy and there are new updates coming for that ctrl
  in the same tick, they will be debounced and only one event will be executed at the end */
  const ctrlOnUpdateIsDirtyFlags: { [key: string]: boolean } = {}
  /** Will be assigned with a function that initialized the on update listeners
  for the nested controllers in main. Serves for checking whether the listeners are already set
  to avoid duplicated/multiple instanced of the onUpdate callbacks for a given ctrl to be initialized in the background */
  let controllersNestedInMainSubscribe: any = null

  onResoleDappNotificationRequest = notificationCtrl.resolveNotificationRequest
  onRejectDappNotificationRequest = notificationCtrl.rejectNotificationRequest

  const fetchPortfolioData = async () => {
    if (!mainCtrl.selectedAccount) return
    return mainCtrl.updateSelectedAccount(mainCtrl.selectedAccount)
  }

  fetchPortfolioData()

  function setPortfolioFetchInterval() {
    clearInterval(fetchPortfolioIntervalId) // Clear existing interval
    fetchPortfolioIntervalId = setInterval(
      () => fetchPortfolioData(),
      // In the case we have an active extension (opened tab, popup, notification),
      // we want to run the interval frequently (1 minute).
      // Otherwise, when inactive we want to run it once in a while (10 minutes).
      Object.keys(portMessageUIRefs).length ? 60000 : 600000
    )
  }

  // Call it once to initialize the interval
  setPortfolioFetchInterval()

  let activityIntervalId: any
  function setActivityInterval(timeout: number) {
    clearInterval(activityIntervalId) // Clear existing interval
    activityIntervalId = setInterval(() => mainCtrl.updateAccountsOpsStatuses(), timeout)
  }

  // refresh the account state once every 5 minutes.
  // if there are BroadcastedButNotConfirmed account ops, start refreshing
  //  once every 7.5 seconds until they are cleared
  let accountStateInterval: any
  let selectedAccountStateInterval: any
  const accountStateIntervals = {
    pending: 3000,
    standBy: 300000
  }

  function setAccountStateInterval(intervalLength: number) {
    clearInterval(accountStateInterval)
    selectedAccountStateInterval = intervalLength

    // if setAccountStateInterval is called with a pending request
    // (this happens after broadcast), update the account state
    // with the pending block without waiting
    if (selectedAccountStateInterval === accountStateIntervals.pending) {
      mainCtrl.updateAccountStates('pending')
    }

    accountStateInterval = setInterval(async () => {
      // update the account state with the latest block in normal
      // circumstances and with the pending block when there are
      // pending account ops
      const blockTag =
        selectedAccountStateInterval === accountStateIntervals.standBy ? 'latest' : 'pending'
      mainCtrl.updateAccountStates(blockTag)

      // if we're in a pending update interval but there are no
      // broadcastedButNotConfirmed account Ops, set the interval to standBy
      if (
        selectedAccountStateInterval === accountStateIntervals.pending &&
        !mainCtrl.activity.broadcastedButNotConfirmed.length
      ) {
        setAccountStateInterval(accountStateIntervals.standBy)
      }
    }, intervalLength)
  }
  // Call it once to initialize the interval
  setAccountStateInterval(accountStateIntervals.standBy)

  // re-estimate interval
  let reestimateInterval: any
  function setReestimateInterval(accountOp: AccountOp) {
    clearInterval(reestimateInterval)

    const currentNetwork = networks.find((network) => network.id === accountOp.networkId)!
    // 12 seconds is the time needed for a new ethereum block
    const time = currentNetwork.reestimateOn ?? 12000
    reestimateInterval = setInterval(async () => {
      mainCtrl.reestimateAndUpdatePrices(accountOp.accountAddr, accountOp.networkId)
    }, time)
  }

  // Nested main controllers for which we want to attach `onUpdate/onError` callbacks.
  // Once we attach the callbacks, we remove the controllers from the queue to prevent attaching the same callbacks twice.
  // Part of the controllers are initialized only once in the very beginning in the main controller (as singletons) and we should be careful to attach the callbacks only once.
  // Some of the controllers are initialized and destroyed multiple times, and we will continuously add and remove them from the mainControllersQueue.
  // These dynamic controllers are defined in the dynamicMainControllers.
  const mainControllersQueue = Object.keys(controllersNestedInMainMapping)
  // Some of the controllers are dynamic and are initialized only when needed. After they complete their tasks, we destroy them and initialize them again only when necessary.
  // Every time we initialize such a controller, we should reattach the callbacks.
  const dynamicMainControllers = ['signAccountOp']

  /**
   * We have the capability to incorporate multiple onUpdate callbacks for a specific controller, allowing multiple listeners for updates in different files.
   * However, in the context of this background service, we only need a single instance of the onUpdate callback for each controller.
   */

  /**
   * Initialize the onUpdate callback for the MainController.
   * Once the mainCtrl load is ready, initialize the rest of the onUpdate callbacks for the nested controllers of the main controller.
   */
  mainCtrl.onUpdate(() => {
    if (ctrlOnUpdateIsDirtyFlags.main) return
    ctrlOnUpdateIsDirtyFlags.main = true

    // Debounce multiple emits in the same tick and only execute one if them
    setTimeout(() => {
      if (ctrlOnUpdateIsDirtyFlags.main) {
        Object.keys(portMessageUIRefs).forEach((key: string) => {
          portMessageUIRefs[key]?.request({
            type: 'broadcast',
            method: 'main',
            params: mainCtrl
          })
        })
        // stringify and then parse to add the getters to the public state
        logInfoWithPrefix('onUpdate (main ctrl)', parse(stringify(mainCtrl)))
      }
      ctrlOnUpdateIsDirtyFlags.main = false
    }, 0)

    if (!mainCtrl.isReady && controllersNestedInMainSubscribe) {
      controllersNestedInMainSubscribe = null
    }

    if (mainCtrl.isReady) {
      dynamicMainControllers.forEach((dynamicCtrl) => {
        // If a dynamic controller was destroyed, we need to reinitialize its callbacks again
        // and that's the reason we push bash the controller to mainControllersQueue
        if (
          !(mainCtrl as any)[dynamicCtrl] &&
          !mainControllersQueue.find((queueCtrl) => queueCtrl === dynamicCtrl)
        ) {
          mainControllersQueue.push(dynamicCtrl)
        }
      })

      for (let i = mainControllersQueue.length - 1; i >= 0; i--) {
        const ctrl = mainControllersQueue[i]

        // Broadcast onUpdate for the nested controllers in main
        ;(mainCtrl as any)[ctrl]?.onUpdate(() => {
          if (ctrlOnUpdateIsDirtyFlags[ctrl]) return
          ctrlOnUpdateIsDirtyFlags[ctrl] = true

          if (ctrl === 'activity') {
            // Start the interval for updating the accounts ops statuses,
            // only if there are broadcasted but not confirmed accounts ops
            if ((mainCtrl as any)[ctrl]?.broadcastedButNotConfirmed.length) {
              // If the interval is already set, then do nothing.
              if (!activityIntervalId) {
                setActivityInterval(5000)
              }
            } else {
              clearInterval(activityIntervalId)
              activityIntervalId = null
            }
          }

          setTimeout(() => {
            if (ctrlOnUpdateIsDirtyFlags[ctrl]) {
              Object.keys(portMessageUIRefs).forEach((key: string) => {
                portMessageUIRefs[key]?.request({
                  type: 'broadcast',
                  method: ctrl,
                  params: (mainCtrl as any)[ctrl]
                })
              })
              // stringify and then parse to add the getters to the public state
              logInfoWithPrefix(`onUpdate (${ctrl} ctrl)`, parse(stringify(mainCtrl)))
            }
            ctrlOnUpdateIsDirtyFlags[ctrl] = false
          }, 0)
        })
        ;(mainCtrl as any)[ctrl]?.onError(() => {
          const errors = (mainCtrl as any)[ctrl].getErrors()
          const lastError = errors[errors.length - 1]
          if (lastError) console.error(lastError.error)
          // stringify and then parse to add the getters to the public state
          logInfoWithPrefix(`onError (${ctrl} ctrl)`, parse(stringify(mainCtrl)))
          Object.keys(portMessageUIRefs).forEach((key: string) => {
            portMessageUIRefs[key]?.request({
              type: 'broadcast-error',
              method: ctrl,
              params: { errors, controller: ctrl }
            })
          })
        })

        // If the child controller exists, it means that we already attached the callbacks in the above lines.
        // If so, we need to remove the child controller from the queue to prevent attaching the same callbacks twice.
        if ((mainCtrl as any)[ctrl]) {
          mainControllersQueue.splice(i, 1)
        }
      }

      // if the signAccountOp controller is active, reestimate
      // at a set period of time
      if (mainCtrl.signAccountOp !== null) {
        setReestimateInterval(mainCtrl.signAccountOp.accountOp)
      } else {
        clearInterval(reestimateInterval)
      }

      // if there are failed networks, refresh the account state every 8 seconds
      // for them until we get a clean state
      const failedNetworkIds = getNetworksWithFailedRPC({
        providers: mainCtrl.settings.providers
      })
      if (failedNetworkIds.length) {
        setTimeout(() => mainCtrl.updateAccountStates('latest', failedNetworkIds), 8000)
      }
    }

    if (mainCtrl.isReady && mainCtrl.selectedAccount) {
      fetchPortfolioData()
    }

    mainCtrl.activity.setAccounts(mainCtrl.accountStates)
  })
  mainCtrl.onError(() => {
    const errors = mainCtrl.getErrors()
    const lastError = errors[errors.length - 1]
    if (lastError) console.error(lastError.error)
    // stringify and then parse to add the getters to the public state
    logInfoWithPrefix('onError (main ctrl)', parse(stringify(mainCtrl)))
    Object.keys(portMessageUIRefs).forEach((key: string) => {
      portMessageUIRefs[key]?.request({
        type: 'broadcast-error',
        method: 'main',
        params: { errors, controller: 'main' }
      })
    })
  })

  // Broadcast onUpdate for the notification controller
  notificationCtrl.onUpdate(() => {
    if (ctrlOnUpdateIsDirtyFlags.notification) return
    ctrlOnUpdateIsDirtyFlags.notification = true
    // Debounce multiple emits in the same tick and only execute one if them
    setTimeout(() => {
      if (ctrlOnUpdateIsDirtyFlags.notification) {
        Object.keys(portMessageUIRefs).forEach((key: string) => {
          portMessageUIRefs[key]?.request({
            type: 'broadcast',
            method: 'notification',
            params: notificationCtrl
          })
        })
      }
      ctrlOnUpdateIsDirtyFlags.notification = false
    }, 0)
  })
  notificationCtrl.onError(() => {
    const errors = notificationCtrl.getErrors()
    const lastError = errors[errors.length - 1]
    if (lastError) console.error(lastError.error)
    Object.keys(portMessageUIRefs).forEach((key: string) => {
      portMessageUIRefs[key]?.request({
        type: 'broadcast-error',
        method: 'notification',
        params: { errors, controller: 'notification' }
      })
    })
  })

  // listen for messages from UI
  browser.runtime.onConnect.addListener(async (port) => {
    if (port.name === 'popup' || port.name === 'notification' || port.name === 'tab') {
      const id = new Date().getTime().toString()
      const pm = new PortMessage(port, id)
      portMessageUIRefs[pm.id] = pm
      setPortfolioFetchInterval()

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
              } else if (data.params.controller === ('notification' as any)) {
                pm.request({
                  type: 'broadcast',
                  method: 'notification',
                  params: notificationCtrl
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
              const keyIterator = new LedgerKeyIterator({
                walletSDK: ledgerCtrl.walletSDK
              })
              return mainCtrl.accountAdder.init({
                keyIterator,
                preselectedAccounts: getPreselectedAccounts(
                  mainCtrl.accounts,
                  mainCtrl.keystore.keys,
                  'ledger'
                ),
                hdPathTemplate: BIP44_LEDGER_DERIVATION_TEMPLATE
              })
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR': {
              const keyIterator = new TrezorKeyIterator({
                walletSDK: trezorCtrl.walletSDK
              })
              return mainCtrl.accountAdder.init({
                keyIterator,
                hdPathTemplate: BIP44_STANDARD_DERIVATION_TEMPLATE,
                preselectedAccounts: getPreselectedAccounts(
                  mainCtrl.accounts,
                  mainCtrl.keystore.keys,
                  'trezor'
                )
              })
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE': {
              const keyIterator = new LatticeKeyIterator({
                sdkSession: latticeCtrl.sdkSession
              })
              return mainCtrl.accountAdder.init({
                keyIterator,
                hdPathTemplate: BIP44_STANDARD_DERIVATION_TEMPLATE,
                preselectedAccounts: getPreselectedAccounts(
                  mainCtrl.accounts,
                  mainCtrl.keystore.keys,
                  'lattice'
                )
              })
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE': {
              const keyIterator = new KeyIterator(data.params.privKeyOrSeed)
              return mainCtrl.accountAdder.init({
                keyIterator,
                hdPathTemplate: BIP44_STANDARD_DERIVATION_TEMPLATE,
                preselectedAccounts: getPreselectedAccounts(
                  mainCtrl.accounts,
                  mainCtrl.keystore.keys,
                  'internal'
                )
              })
            }
            case 'MAIN_CONTROLLER_SETTINGS_ADD_ACCOUNT_PREFERENCES': {
              return mainCtrl.settings.addAccountPreferences(data.params)
            }
            case 'MAIN_CONTROLLER_SETTINGS_ADD_KEY_PREFERENCES': {
              return mainCtrl.settings.addKeyPreferences(data.params)
            }
            case 'MAIN_CONTROLLER_UPDATE_NETWORK_PREFERENCES': {
              return mainCtrl.updateNetworkPreferences(
                data.params.networkPreferences,
                data.params.networkId
              )
            }
            case 'MAIN_CONTROLLER_RESET_NETWORK_PREFERENCE': {
              return mainCtrl.resetNetworkPreference(
                data.params.preferenceKey,
                data.params.networkId
              )
            }
            case 'MAIN_CONTROLLER_SELECT_ACCOUNT': {
              return mainCtrl.selectAccount(data.params.accountAddr)
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SELECT_ACCOUNT': {
              return mainCtrl.accountAdder.selectAccount(data.params.account)
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_DESELECT_ACCOUNT': {
              return mainCtrl.accountAdder.deselectAccount(data.params.account)
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET': {
              return mainCtrl.accountAdder.reset()
            }
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE':
              return mainCtrl.accountAdder.setPage({
                ...data.params,
                networks,
                providers: rpcProviders
              })
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS':
              return mainCtrl.accountAdder.addAccounts(data.params.selectedAccounts)
            case 'MAIN_CONTROLLER_ADD_ACCOUNTS':
              return mainCtrl.addAccounts(data.params.accounts)
            case 'MAIN_CONTROLLER_ADD_USER_REQUEST':
              return mainCtrl.addUserRequest(data.params)
            case 'MAIN_CONTROLLER_REMOVE_USER_REQUEST':
              return mainCtrl.removeUserRequest(data.params.id)
            case 'MAIN_CONTROLLER_SIGN_MESSAGE_INIT':
              return mainCtrl.signMessage.init(data.params)
            case 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET':
              return mainCtrl.signMessage.reset()
            case 'MAIN_CONTROLLER_SIGN_MESSAGE_SIGN': {
              return mainCtrl.signMessage.sign()
            }
            case 'MAIN_CONTROLLER_SIGN_MESSAGE_SET_SIGN_KEY':
              return mainCtrl.signMessage.setSigningKey(data.params.key, data.params.type)
            case 'MAIN_CONTROLLER_BROADCAST_SIGNED_MESSAGE':
              return mainCtrl.broadcastSignedMessage(data.params.signedMessage)
            case 'MAIN_CONTROLLER_ACTIVITY_INIT':
              return mainCtrl.activity.init({
                filters: data.params.filters
              })
            case 'MAIN_CONTROLLER_ACTIVITY_SET_FILTERS':
              return mainCtrl.activity.setFilters(data.params.filters)
            case 'MAIN_CONTROLLER_ACTIVITY_SET_ACCOUNT_OPS_PAGINATION':
              return mainCtrl.activity.setAccountsOpsPagination(data.params.pagination)
            case 'MAIN_CONTROLLER_ACTIVITY_SET_SIGNED_MESSAGES_PAGINATION':
              return mainCtrl.activity.setSignedMessagesPagination(data.params.pagination)
            case 'MAIN_CONTROLLER_ACTIVITY_RESET':
              return mainCtrl.activity.reset()

            case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE':
              return mainCtrl?.signAccountOp?.update(data.params)
            case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_SIGN': {
              return mainCtrl?.signAccountOp?.sign()
            }
            case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_INIT':
              return mainCtrl.initSignAccOp(data.params.accountAddr, data.params.networkId)
            case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_DESTROY':
              return mainCtrl.destroySignAccOp()
            case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_ESTIMATE':
              return mainCtrl.reestimateAndUpdatePrices(
                data.params.accountAddr,
                data.params.networkId
              )

            case 'MAIN_CONTROLLER_TRANSFER_UPDATE':
              return mainCtrl.transfer.update(data.params)
            case 'MAIN_CONTROLLER_TRANSFER_RESET_FORM':
              return mainCtrl.transfer.resetForm()
            case 'MAIN_CONTROLLER_TRANSFER_BUILD_USER_REQUEST':
              return mainCtrl.transfer.buildUserRequest()
            case 'MAIN_CONTROLLER_TRANSFER_ON_RECIPIENT_ADDRESS_CHANGE':
              return mainCtrl.transfer.onRecipientAddressChange()
            case 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST': {
              notificationCtrl.resolveNotificationRequest(data.params.data, data.params.id)
              break
            }
            case 'NOTIFICATION_CONTROLLER_REJECT_REQUEST': {
              notificationCtrl.rejectNotificationRequest(data.params.err, data.params.id)
              break
            }

            case 'NOTIFICATION_CONTROLLER_REOPEN_CURRENT_NOTIFICATION_REQUEST':
              return notificationCtrl.reopenCurrentNotificationRequest()
            case 'NOTIFICATION_CONTROLLER_OPEN_NOTIFICATION_REQUEST':
              return notificationCtrl.openNotificationRequest(data.params.id)

            case 'LEDGER_CONTROLLER_UNLOCK':
              return ledgerCtrl.unlock()

            case 'LATTICE_CONTROLLER_UNLOCK':
              return latticeCtrl.unlock()

            case 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT': {
              if (!mainCtrl.selectedAccount) return
              return mainCtrl.updateSelectedAccount(
                mainCtrl.selectedAccount,
                data.params?.forceUpdate
              )
            }
            case 'KEYSTORE_CONTROLLER_ADD_SECRET':
              return mainCtrl.keystore.addSecret(
                data.params.secretId,
                data.params.secret,
                data.params.extraEntropy,
                data.params.leaveUnlocked
              )
            case 'KEYSTORE_CONTROLLER_ADD_KEYS_EXTERNALLY_STORED': {
              const { keyType } = data.params

              const deviceIds: { [key in ExternalKey['type']]: string } = {
                ledger: ledgerCtrl.deviceId,
                trezor: trezorCtrl.deviceId,
                lattice: latticeCtrl.deviceId
              }

              const deviceModels: { [key in ExternalKey['type']]: string } = {
                ledger: ledgerCtrl.deviceModel,
                trezor: trezorCtrl.deviceModel,
                lattice: latticeCtrl.deviceModel
              }

              const keys = mainCtrl.accountAdder.selectedAccounts.map(
                ({ accountKeyAddr, index }) => ({
                  addr: accountKeyAddr,
                  type: keyType,
                  meta: {
                    deviceId: deviceIds[keyType],
                    deviceModel: deviceModels[keyType],
                    // always defined in the case of external keys
                    hdPathTemplate: mainCtrl.accountAdder.hdPathTemplate as HD_PATH_TEMPLATE_TYPE,
                    index
                  }
                })
              )

              return mainCtrl.keystore.addKeysExternallyStored(keys)
            }
            case 'KEYSTORE_CONTROLLER_UNLOCK_WITH_SECRET':
              return mainCtrl.keystore.unlockWithSecret(data.params.secretId, data.params.secret)
            case 'KEYSTORE_CONTROLLER_LOCK':
              return mainCtrl.keystore.lock()
            case 'KEYSTORE_CONTROLLER_ADD_KEYS':
              return mainCtrl.keystore.addKeys(data.params.keys)
            case 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE':
              return mainCtrl.keystore.resetErrorState()
            case 'KEYSTORE_CONTROLLER_CHANGE_PASSWORD':
              return mainCtrl.keystore.changeKeystorePassword(
                data.params.secret,
                data.params.newSecret
              )
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
            case 'CHANGE_CURRENT_DAPP_NETWORK': {
              permissionService.updateConnectSite(
                data.params.origin,
                { chainId: data.params.chainId },
                true
              )
              sessionService.broadcastEvent('chainChanged', {
                chain: `0x${data.params.chainId.toString(16)}`,
                networkVersion: `${data.params.chainId}`
              })
              break
            }

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

      port.onDisconnect.addListener(() => {
        delete portMessageUIRefs[pm.id]
        setPortfolioFetchInterval()

        if (port.name === 'tab' || port.name === 'notification') {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          ledgerCtrl.cleanUp()
          trezorCtrl.cleanUp()
        }
      })

      eventBus.addEventListener('broadcastToUI', broadcastCallback)
      port.onDisconnect.addListener(() => {
        eventBus.removeEventListener('broadcastToUI', broadcastCallback)
      })

      return
    }

    if (!port.sender?.tab) {
      return
    }

    const pm = new PortMessage(port)

    pm.listen(async (data: any) => {
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

      return provider({ ...req, mainCtrl, notificationCtrl })
    })
  })
})()

// Open the get-started screen in a new tab right after the extension is installed.
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    setTimeout(() => {
      const extensionURL = browser.runtime.getURL('tab.html')
      browser.tabs.create({ url: extensionURL })
    }, 500)
  }
})

// Send a browser notification when the signing process of a message or account op is finalized
const notifyForSuccessfulBroadcast = async (type: 'message' | 'typed-data' | 'account-op') => {
  const title = 'Successfully signed'
  let message = ''
  if (type === 'message') {
    message = 'Message was successfully signed'
  }
  if (type === 'typed-data') {
    message = 'TypedData was successfully signed'
  }
  if (type === 'account-op') {
    message = 'Your transaction was successfully signed and broadcasted to the network'
  }

  const id = new Date().getTime()
  // service_worker (mv3) - without await the notification doesn't show
  await browser.notifications.create(id.toString(), {
    type: 'basic',
    iconUrl: browser.runtime.getURL('assets/images/xicon@96.png'),
    title,
    message
  })
}

/*
 * This content script is injected programmatically because
 * MAIN world injection does not work properly via manifest
 * https://bugs.chromium.org/p/chromium/issues/detail?id=634381
 */
const registerInPageContentScript = async () => {
  try {
    await browser.scripting.registerContentScripts([
      {
        id: 'inpage',
        matches: ['file://*/*', 'http://*/*', 'https://*/*'],
        js: ['inpage.js'],
        runAt: 'document_start',
        world: 'MAIN'
      }
    ])
  } catch (err) {
    console.warn(`Failed to inject EthereumProvider: ${err}`)
  }
}

// For mv2 the injection is located in the content-script
if (isManifestV3) {
  registerInPageContentScript()
}
