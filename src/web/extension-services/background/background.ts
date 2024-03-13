/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
import 'setimmediate'

import {
  BIP44_LEDGER_DERIVATION_TEMPLATE,
  BIP44_STANDARD_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import humanizerJSON from '@ambire-common/consts/humanizer/humanizerInfo.json'
import { networks } from '@ambire-common/consts/networks'
import { ReadyToAddKeys } from '@ambire-common/controllers/accountAdder/accountAdder'
import { MainController } from '@ambire-common/controllers/main/main'
import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { ExternalKey } from '@ambire-common/interfaces/keystore'
import { AccountPreferences } from '@ambire-common/interfaces/settings'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import { HUMANIZER_META_KEY } from '@ambire-common/libs/humanizer'
import { HumanizerMeta } from '@ambire-common/libs/humanizer/interfaces'
import { getPrivateKeyFromSeed, KeyIterator } from '@ambire-common/libs/keyIterator/keyIterator'
import { KeystoreSigner } from '@ambire-common/libs/keystoreSigner/keystoreSigner'
import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
import { getNetworksWithFailedRPC } from '@ambire-common/libs/settings/settings'
import { areRpcProvidersInitialized, initRpcProviders } from '@ambire-common/services/provider'
import { rpcProviders } from '@common/services/providers'
import { RELAYER_URL } from '@env'
import { browser, isManifestV3 } from '@web/constants/browserapi'
import { BadgesController } from '@web/extension-services/background/controllers/badges'
import { NotificationController } from '@web/extension-services/background/controllers/notification'
import provider from '@web/extension-services/background/provider/provider'
import permissionService from '@web/extension-services/background/services/permission'
import sessionService from '@web/extension-services/background/services/session'
import { storage } from '@web/extension-services/background/webapi/storage'
import PortMessage from '@web/extension-services/message/portMessage'
import { getPreselectedAccounts } from '@web/modules/account-adder/helpers/account'
import {
  getDefaultAccountPreferences,
  getDefaultKeyLabel
} from '@web/modules/account-personalize/libs/defaults'
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
import { WalletStateController } from './controllers/wallet-state'
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

  const humanizerMetaInStorage: HumanizerMeta = await storage.get(HUMANIZER_META_KEY, {})
  if (
    Object.keys(humanizerMetaInStorage).length === 0 ||
    Object.keys(humanizerMetaInStorage.knownAddresses).length <
      Object.keys(humanizerJSON.knownAddresses).length ||
    Object.keys(humanizerMetaInStorage.abis).length < Object.keys(humanizerJSON.abis).length ||
    Object.keys(humanizerMetaInStorage.abis.NO_ABI).length <
      Object.keys(humanizerJSON.abis.NO_ABI).length
  )
    await storage.set(HUMANIZER_META_KEY, humanizerJSON)

  await permissionService.init()
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  if (isManifestV3) {
    saveTimestamp()
    // Save the timestamp immediately and then every `SAVE_TIMESTAMP_INTERVAL`
    // miliseconds. This keeps the service worker alive.
    const SAVE_TIMESTAMP_INTERVAL_MS = 2 * 1000
    setInterval(saveTimestamp, SAVE_TIMESTAMP_INTERVAL_MS)
  }
  await init()

  const backgroundState: {
    ctrlOnUpdateIsDirtyFlags: { [key: string]: boolean }
    accountStateIntervals: {
      pending: number
      standBy: number
    }
    hasSignAccountOpCtrlInitialized: boolean
    portMessageUIRefs: { [key: string]: PortMessage }
    fetchPortfolioIntervalId?: ReturnType<typeof setInterval>
    activityIntervalId?: ReturnType<typeof setInterval>
    reestimateInterval?: ReturnType<typeof setInterval>
    accountStateInterval?: ReturnType<typeof setInterval>
    selectedAccountStateInterval?: number
    onResoleDappNotificationRequest?: (data: any, id?: number) => void
    onRejectDappNotificationRequest?: (data: any, id?: number) => void
  } = {
    /**
      ctrlOnUpdateIsDirtyFlags will be set to true for a given ctrl when it receives an update in the ctrl.onUpdate callback.
      While the flag is truthy and there are new updates coming for that ctrl in the same tick, they will be debounced and only one event will be executed at the end
    */
    ctrlOnUpdateIsDirtyFlags: {},
    accountStateIntervals: {
      pending: 3000,
      standBy: 300000
    },
    hasSignAccountOpCtrlInitialized: false,
    portMessageUIRefs: {}
  }

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
      !!backgroundState.onResoleDappNotificationRequest &&
        backgroundState.onResoleDappNotificationRequest(data, id)
    },
    onRejectDappRequest: (err, id) => {
      !!backgroundState.onRejectDappNotificationRequest &&
        backgroundState.onRejectDappNotificationRequest(err, id)
    },
    onUpdateDappSelectedAccount: (accountAddr) => {
      const account = accountAddr ? [accountAddr] : []
      return sessionService.broadcastEvent('accountsChanged', account)
    },
    onBroadcastSuccess: (type: 'message' | 'typed-data' | 'account-op') => {
      notifyForSuccessfulBroadcast(type)
      setAccountStateInterval(backgroundState.accountStateIntervals.pending)
    }
  })
  const walletStateCtrl = new WalletStateController()
  const notificationCtrl = new NotificationController(mainCtrl)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const badgesCtrl = new BadgesController(mainCtrl, notificationCtrl)

  backgroundState.onResoleDappNotificationRequest = notificationCtrl.resolveNotificationRequest
  backgroundState.onRejectDappNotificationRequest = notificationCtrl.rejectNotificationRequest

  function setPortfolioFetchInterval() {
    !!backgroundState.fetchPortfolioIntervalId &&
      clearInterval(backgroundState.fetchPortfolioIntervalId)

    // mainCtrl.updateSelectedAccount(mainCtrl.selectedAccount)
    backgroundState.fetchPortfolioIntervalId = setInterval(
      () => mainCtrl.updateSelectedAccount(mainCtrl.selectedAccount),
      // In the case we have an active extension (opened tab, popup, notification), we want to run the interval frequently (1 minute).
      // Otherwise, when inactive we want to run it once in a while (10 minutes).
      Object.keys(backgroundState.portMessageUIRefs).length ? 60000 : 600000
    )
  }

  setPortfolioFetchInterval() // Call it once to initialize the interval

  function setActivityInterval(timeout: number) {
    !!backgroundState.activityIntervalId && clearInterval(backgroundState.activityIntervalId)
    backgroundState.activityIntervalId = setInterval(
      () => mainCtrl.updateAccountsOpsStatuses(),
      timeout
    )
  }

  function setAccountStateInterval(intervalLength: number) {
    !!backgroundState.accountStateInterval && clearInterval(backgroundState.accountStateInterval)
    backgroundState.selectedAccountStateInterval = intervalLength

    // if setAccountStateInterval is called with a pending request (this happens after broadcast),
    // update the account state with the pending block without waiting
    if (
      backgroundState.selectedAccountStateInterval === backgroundState.accountStateIntervals.pending
    ) {
      mainCtrl.updateAccountStates('pending')
    }

    backgroundState.accountStateInterval = setInterval(async () => {
      // update the account state with the latest block in normal circumstances
      // and with the pending block when there are pending account ops
      const blockTag =
        backgroundState.selectedAccountStateInterval ===
        backgroundState.accountStateIntervals.standBy
          ? 'latest'
          : 'pending'
      mainCtrl.updateAccountStates(blockTag)

      // if we're in a pending update interval but there are no broadcastedButNotConfirmed account Ops, set the interval to standBy
      if (
        backgroundState.selectedAccountStateInterval ===
          backgroundState.accountStateIntervals.pending &&
        !mainCtrl.activity.broadcastedButNotConfirmed.length
      ) {
        setAccountStateInterval(backgroundState.accountStateIntervals.standBy)
      }
    }, intervalLength)
  }

  setAccountStateInterval(backgroundState.accountStateIntervals.standBy) // Call it once to initialize the interval

  function setReestimateInterval(accountOp: AccountOp) {
    !!backgroundState.reestimateInterval && clearInterval(backgroundState.reestimateInterval)

    const currentNetwork = networks.find((network) => network.id === accountOp.networkId)!
    // 12 seconds is the time needed for a new ethereum block
    const time = currentNetwork.reestimateOn ?? 12000
    backgroundState.reestimateInterval = setInterval(async () => {
      mainCtrl.reestimateAndUpdatePrices(accountOp.accountAddr, accountOp.networkId)
    }, time)
  }

  function debounceFrontEndEventUpdatesOnSameTick(
    ctrlName: string,
    ctrl: any,
    stateToLog?: any
  ): 'DEBOUNCED' | 'EMITTED' {
    if (backgroundState.ctrlOnUpdateIsDirtyFlags[ctrlName]) return 'DEBOUNCED'
    backgroundState.ctrlOnUpdateIsDirtyFlags[ctrlName] = true

    // Debounce multiple emits in the same tick and only execute one if them
    setTimeout(() => {
      if (backgroundState.ctrlOnUpdateIsDirtyFlags[ctrlName]) {
        Object.keys(backgroundState.portMessageUIRefs).forEach((key: string) => {
          backgroundState.portMessageUIRefs[key]?.send('broadcast', {
            type: 'broadcast',
            method: ctrlName,
            params: ctrl
          })
        })
        logInfoWithPrefix(`onUpdate (${ctrlName} ctrl)`, parse(stringify(stateToLog || mainCtrl)))
      }
      backgroundState.ctrlOnUpdateIsDirtyFlags[ctrlName] = false
    }, 0)

    return 'EMITTED'
  }

  /**
    Initialize the onUpdate callback for the MainController. Once the mainCtrl load is ready,
    initialize the rest of the onUpdate callbacks for the nested controllers of the main controller.
   */
  mainCtrl.onUpdate(() => {
    const res = debounceFrontEndEventUpdatesOnSameTick('main', mainCtrl)
    if (res === 'DEBOUNCED') return

    // if the signAccountOp controller is active, reestimate at a set period of time
    if (backgroundState.hasSignAccountOpCtrlInitialized !== !!mainCtrl.signAccountOp) {
      if (
        mainCtrl.signAccountOp &&
        (mainCtrl.signAccountOp.status === null ||
          mainCtrl.signAccountOp.status.type !== SigningStatus.EstimationError)
      ) {
        setReestimateInterval(mainCtrl.signAccountOp.accountOp)
      } else {
        !!backgroundState.reestimateInterval && clearInterval(backgroundState.reestimateInterval)
      }

      backgroundState.hasSignAccountOpCtrlInitialized = !!mainCtrl.signAccountOp
    }

    Object.keys(controllersNestedInMainMapping).forEach((ctrlName) => {
      const controller = (mainCtrl as any)[ctrlName]
      if (Array.isArray(controller?.onUpdateIds)) {
        /**
         * We have the capability to incorporate multiple onUpdate callbacks for a specific controller, allowing multiple listeners for updates in different files.
         * However, in the context of this background service, we only need a single instance of the onUpdate callback for each controller.
         */
        const hasOnUpdateInitialized = controller.onUpdateIds.includes('background')

        if (!hasOnUpdateInitialized) {
          controller?.onUpdate(() => {
            const res = debounceFrontEndEventUpdatesOnSameTick(ctrlName, controller)
            if (res === 'DEBOUNCED') return

            if (ctrlName === 'activity') {
              // Start the interval for updating the accounts ops statuses, only if there are broadcasted but not confirmed accounts ops
              if (controller?.broadcastedButNotConfirmed.length) {
                // If the interval is already set, then do nothing.
                if (!backgroundState.activityIntervalId) {
                  setActivityInterval(5000)
                }
              } else {
                !!backgroundState.activityIntervalId &&
                  clearInterval(backgroundState.activityIntervalId)
                delete backgroundState.activityIntervalId
              }
            }
          }, 'background')
        }
      }

      if (Array.isArray(controller?.onErrorIds)) {
        const hasOnErrorInitialized = controller.onErrorIds.includes('background')

        if (!hasOnErrorInitialized) {
          ;(mainCtrl as any)[ctrlName]?.onError(() => {
            logInfoWithPrefix(`onError (${ctrlName} ctrl)`, parse(stringify(mainCtrl)))
            Object.keys(backgroundState.portMessageUIRefs).forEach((key: string) => {
              backgroundState.portMessageUIRefs[key]?.send('broadcast', {
                type: 'broadcast-error',
                method: ctrlName,
                params: { errors: (mainCtrl as any)[ctrlName].emittedErrors, controller: ctrlName }
              })
            })
          }, 'background')
        }
      }
    })

    if (mainCtrl.isReady) {
      // if there are failed networks, refresh the account state every 8 seconds
      // for them until we get a clean state
      const failedNetworkIds = getNetworksWithFailedRPC({
        providers: mainCtrl.settings.providers
      })
      if (failedNetworkIds.length) {
        setTimeout(() => mainCtrl.updateAccountStates('latest', failedNetworkIds), 8000)
      }
    }
  }, 'background')
  mainCtrl.onError(() => {
    logInfoWithPrefix('onError (main ctrl)', parse(stringify(mainCtrl)))
    Object.keys(backgroundState.portMessageUIRefs).forEach((key: string) => {
      backgroundState.portMessageUIRefs[key]?.send('broadcast', {
        type: 'broadcast-error',
        method: 'main',
        params: { errors: mainCtrl.emittedErrors, controller: 'main' }
      })
    })
  })

  // Broadcast onUpdate for the wallet state controller
  walletStateCtrl.onUpdate(() => {
    debounceFrontEndEventUpdatesOnSameTick('walletState', walletStateCtrl, walletStateCtrl)
  })
  walletStateCtrl.onError(() => {
    Object.keys(backgroundState.portMessageUIRefs).forEach((key: string) => {
      backgroundState.portMessageUIRefs[key]?.send('broadcast', {
        type: 'broadcast-error',
        method: 'walletState',
        params: { errors: walletStateCtrl.emittedErrors, controller: 'walletState' }
      })
    })
  })

  // Broadcast onUpdate for the notification controller
  notificationCtrl.onUpdate(() => {
    debounceFrontEndEventUpdatesOnSameTick('notification', notificationCtrl, notificationCtrl)
  })
  notificationCtrl.onError(() => {
    Object.keys(backgroundState.portMessageUIRefs).forEach((key: string) => {
      backgroundState.portMessageUIRefs[key]?.send('broadcast', {
        type: 'broadcast-error',
        method: 'notification',
        params: { errors: notificationCtrl.emittedErrors, controller: 'notification' }
      })
    })
  })

  // listen for messages from UI
  browser.runtime.onConnect.addListener(async (port) => {
    if (port.name === 'popup' || port.name === 'notification' || port.name === 'tab') {
      const id = new Date().getTime().toString()
      const pm = new PortMessage(port, id)
      backgroundState.portMessageUIRefs[pm.id] = pm
      setPortfolioFetchInterval()

      pm.listen(async (data: Action) => {
        if (data?.type) {
          switch (data.type) {
            case 'INIT_CONTROLLER_STATE': {
              if (data.params.controller === ('main' as any)) {
                pm.send('broadcast', {
                  type: 'broadcast',
                  method: 'main',
                  params: mainCtrl
                })
              } else if (data.params.controller === ('notification' as any)) {
                pm.send('broadcast', {
                  type: 'broadcast',
                  method: 'notification',
                  params: notificationCtrl
                })
              } else if (data.params.controller === ('walletState' as any)) {
                pm.send('broadcast', {
                  type: 'broadcast',
                  method: 'walletState',
                  params: walletStateCtrl
                })
              } else {
                pm.send('broadcast', {
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
              const pageSize = data.params.keyTypeInternalSubtype === 'private-key' ? 1 : 5
              const keyIterator = new KeyIterator(data.params.privKeyOrSeed)
              return mainCtrl.accountAdder.init({
                keyIterator,
                pageSize,
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
            case 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS': {
              const readyToAddKeys: ReadyToAddKeys = {
                internal: data.params.readyToAddKeys.internal,
                external: []
              }

              if (data.params.readyToAddKeys.externalTypeOnly) {
                const keyType = data.params.readyToAddKeys.externalTypeOnly

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

                const readyToAddExternalKeys = mainCtrl.accountAdder.selectedAccounts.map(
                  ({ accountKeyAddr, index, isLinked }) => ({
                    addr: accountKeyAddr,
                    type: keyType,
                    dedicatedToOneSA: !isLinked,
                    meta: {
                      deviceId: deviceIds[keyType],
                      deviceModel: deviceModels[keyType],
                      // always defined in the case of external keys
                      hdPathTemplate: mainCtrl.accountAdder.hdPathTemplate as HD_PATH_TEMPLATE_TYPE,
                      index
                    }
                  })
                )

                readyToAddKeys.external = readyToAddExternalKeys
              }

              return mainCtrl.accountAdder.addAccounts(
                data.params.selectedAccounts,
                data.params.readyToAddAccountPreferences,
                readyToAddKeys,
                data.params.readyToAddKeyPreferences
              )
            }
            case 'MAIN_CONTROLLER_ADD_VIEW_ONLY_ACCOUNTS': {
              const defaultAccountPreferences = getDefaultAccountPreferences(
                data.params.accounts,
                mainCtrl.accounts
              )

              const ensOrUdAccountPreferences: AccountPreferences = data.params.accounts.reduce(
                (acc: AccountPreferences, account) => {
                  if (account.domainName) {
                    acc[account.addr] = {
                      pfp: defaultAccountPreferences[account.addr].pfp,
                      label: account.domainName
                    }
                    return acc
                  }

                  return acc
                },
                {}
              )

              // Since these accounts are view-only, directly add them in the
              // MainController, bypassing the AccountAdder flow.
              await mainCtrl.addAccounts(data.params.accounts)

              // And manually trigger some of the `onAccountAdderSuccess` steps
              // that are needed for view-only accounts, since the AccountAdder
              // flow was bypassed and the `onAccountAdderSuccess` subscription
              // in the MainController won't click.
              return Promise.all([
                mainCtrl.settings.addAccountPreferences({
                  ...defaultAccountPreferences,
                  ...ensOrUdAccountPreferences
                }),
                mainCtrl.selectAccount(data.params.accounts[0].addr)
              ])
            }
            // This flow interacts manually with the AccountAdder controller so that it can
            // auto pick the first smart account and import it, thus skipping the AccountAdder flow.
            case 'MAIN_CONTROLLER_ADD_SEED_PHRASE_ACCOUNT': {
              const seed = data.params.seed
              const keyIterator = new KeyIterator(seed)

              await mainCtrl.accountAdder.init({
                keyIterator,
                hdPathTemplate: BIP44_STANDARD_DERIVATION_TEMPLATE,
                preselectedAccounts: [],
                pageSize: 1
              })

              await mainCtrl.accountAdder.setPage({
                page: 1,
                networks,
                providers: rpcProviders
              })

              const firstSmartAccount = mainCtrl.accountAdder.accountsOnPage.find(
                ({ slot, isLinked, account }) => slot === 1 && !isLinked && isSmartAccount(account)
              )?.account

              // This should never happen (added it because of typescript)
              if (!firstSmartAccount) {
                console.error('No smart account found in the first page of the seed phrase')

                return
              }

              await mainCtrl.accountAdder.selectAccount(firstSmartAccount)

              const readyToAddAccountPreferences = getDefaultAccountPreferences(
                mainCtrl.accountAdder.selectedAccounts.map(({ account }) => account),
                mainCtrl.accounts,
                'internal',
                'seed'
              )

              const readyToAddKeys = mainCtrl.accountAdder.selectedAccounts.map((acc) => {
                const privateKey = getPrivateKeyFromSeed(
                  seed,
                  acc.index,
                  // should always be provided, otherwise it would have thrown an error above
                  mainCtrl.accountAdder.hdPathTemplate as HD_PATH_TEMPLATE_TYPE
                )

                return { privateKey, dedicatedToOneSA: true }
              })

              const readyToAddKeyPreferences = mainCtrl.accountAdder.selectedAccounts.map(
                ({ accountKeyAddr, slot, index }) => ({
                  addr: accountKeyAddr,
                  type: 'seed',
                  label: getDefaultKeyLabel('internal', index, slot)
                })
              )

              return mainCtrl.accountAdder.addAccounts(
                mainCtrl.accountAdder.selectedAccounts,
                readyToAddAccountPreferences,
                {
                  internal: readyToAddKeys,
                  external: []
                },
                readyToAddKeyPreferences
              )
            }
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
                data.params?.forceUpdate,
                data.params?.additionalHints
              )
            }
            case 'PORTFOLIO_CONTROLLER_UPDATE_TOKEN_PREFERENCES': {
              await mainCtrl.portfolio.updateTokenPreferences(data.params.tokenPreferences)
              return mainCtrl.updateSelectedAccount(mainCtrl.selectedAccount)
            }
            case 'PORTFOLIO_CONTROLLER_RESET_ADDITIONAL_HINTS': {
              return mainCtrl.portfolio.resetAdditionalHints()
            }
            case 'PORTFOLIO_CONTROLLER_CHECK_TOKEN': {
              return mainCtrl.portfolio.checkTokenStandardEligibility(
                data.params.token,
                mainCtrl.selectedAccount
              )
            }
            case 'KEYSTORE_CONTROLLER_ADD_SECRET':
              return mainCtrl.keystore.addSecret(
                data.params.secretId,
                data.params.secret,
                data.params.extraEntropy,
                data.params.leaveUnlocked
              )
            case 'KEYSTORE_CONTROLLER_UNLOCK_WITH_SECRET':
              return mainCtrl.keystore.unlockWithSecret(data.params.secretId, data.params.secret)
            case 'KEYSTORE_CONTROLLER_LOCK':
              return mainCtrl.keystore.lock()
            case 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE':
              return mainCtrl.keystore.resetErrorState()
            case 'KEYSTORE_CONTROLLER_CHANGE_PASSWORD':
              return mainCtrl.keystore.changeKeystorePassword(
                data.params.newSecret,
                data.params.secret
              )
            case 'KEYSTORE_CONTROLLER_CHANGE_PASSWORD_FROM_RECOVERY':
              // In the case we change the user's device password through the recovery process,
              // we don't know the old password, which is why we send only the new password.
              return mainCtrl.keystore.changeKeystorePassword(data.params.newSecret)

            case 'EMAIL_VAULT_CONTROLLER_GET_INFO':
              return mainCtrl.emailVault.getEmailVaultInfo(data.params.email)
            case 'EMAIL_VAULT_CONTROLLER_UPLOAD_KEYSTORE_SECRET':
              return mainCtrl.emailVault.uploadKeyStoreSecret(data.params.email)
            case 'EMAIL_VAULT_CONTROLLER_HANDLE_MAGIC_LINK_KEY':
              return mainCtrl.emailVault.handleMagicLinkKey(data.params.email)
            case 'EMAIL_VAULT_CONTROLLER_CANCEL_CONFIRMATION':
              return mainCtrl.emailVault.cancelEmailConfirmation()
            case 'EMAIL_VAULT_CONTROLLER_RECOVER_KEYSTORE':
              return mainCtrl.emailVault.recoverKeyStore(data.params.email, data.params.newPass)
            case 'EMAIL_VAULT_CONTROLLER_CLEAN_MAGIC_AND_SESSION_KEYS':
              return mainCtrl.emailVault.cleanMagicAndSessionKeys()
            case 'EMAIL_VAULT_CONTROLLER_REQUEST_KEYS_SYNC':
              return mainCtrl.emailVault.requestKeysSync(data.params.email, data.params.keys)
            case 'SET_IS_DEFAULT_WALLET': {
              walletStateCtrl.isDefaultWallet = data.params.isDefaultWallet
              break
            }
            case 'SET_ONBOARDING_STATE': {
              walletStateCtrl.onboardingState = data.params
              break
            }
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

      port.onDisconnect.addListener(() => {
        delete backgroundState.portMessageUIRefs[pm.id]
        setPortfolioFetchInterval()

        if (port.name === 'tab' || port.name === 'notification') {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          ledgerCtrl.cleanUp()
          trezorCtrl.cleanUp()
        }
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
browser.runtime.onInstalled.addListener(({ reason }: any) => {
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
