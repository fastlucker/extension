/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
import 'setimmediate'

import { nanoid } from 'nanoid'

import {
  BIP44_LEDGER_DERIVATION_TEMPLATE,
  BIP44_STANDARD_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import humanizerJSON from '@ambire-common/consts/humanizer/humanizerInfo.json'
import { MainController } from '@ambire-common/controllers/main/main'
import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { ExternalKey, Key, ReadyToAddKeys } from '@ambire-common/interfaces/keystore'
import { AccountPreferences } from '@ambire-common/interfaces/settings'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import { HUMANIZER_META_KEY } from '@ambire-common/libs/humanizer'
import { HumanizerMeta } from '@ambire-common/libs/humanizer/interfaces'
import { KeyIterator } from '@ambire-common/libs/keyIterator/keyIterator'
import { KeystoreSigner } from '@ambire-common/libs/keystoreSigner/keystoreSigner'
import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
import { getNetworksWithFailedRPC } from '@ambire-common/libs/settings/settings'
import { RELAYER_URL, ENVIRONMENT } from '@env'
import { browser, isManifestV3 } from '@web/constants/browserapi'
import { BadgesController } from '@web/extension-services/background/controllers/badges'
import { DappsController } from '@web/extension-services/background/controllers/dapps'
import { NotificationController } from '@web/extension-services/background/controllers/notification'
import { WalletStateController } from '@web/extension-services/background/controllers/wallet-state'
import handleProviderRequests from '@web/extension-services/background/provider/handleProviderRequests'
import { providerRequestTransport } from '@web/extension-services/background/provider/providerRequestTransport'
import { controllersNestedInMainMapping } from '@web/extension-services/background/types'
import { storage } from '@web/extension-services/background/webapi/storage'
import { initializeMessenger, Port, PortMessenger } from '@web/extension-services/messengers'
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

function saveTimestamp() {
  const timestamp = new Date().toISOString()

  browser.storage.session.set({ timestamp })
}

async function init() {
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
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  if (ENVIRONMENT === 'testing') {
    await new Promise((r) => {
      setTimeout(r, 1000)
    })
  }

  if (isManifestV3) {
    saveTimestamp()
    // Save the timestamp immediately and then every `SAVE_TIMESTAMP_INTERVAL`
    // miliseconds. This keeps the service worker alive.
    const SAVE_TIMESTAMP_INTERVAL_MS = 2 * 1000
    setInterval(saveTimestamp, SAVE_TIMESTAMP_INTERVAL_MS)
  }
  await init()

  const backgroundState: {
    isUnlocked: boolean
    ctrlOnUpdateIsDirtyFlags: { [key: string]: boolean }
    accountStateIntervals: {
      pending: number
      standBy: number
    }
    hasSignAccountOpCtrlInitialized: boolean
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
    isUnlocked: false,
    ctrlOnUpdateIsDirtyFlags: {},
    accountStateIntervals: {
      pending: 3000,
      standBy: 300000
    },
    hasSignAccountOpCtrlInitialized: false
  }

  const pm = new PortMessenger()
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
      return dappsCtrl.broadcastDappSessionEvent('accountsChanged', account)
    },
    onBroadcastSuccess: (type: 'message' | 'typed-data' | 'account-op') => {
      notifyForSuccessfulBroadcast(type)
      setAccountStateInterval(backgroundState.accountStateIntervals.pending)
    }
  })
  const walletStateCtrl = new WalletStateController()
  const dappsCtrl = new DappsController(storage)
  const notificationCtrl = new NotificationController(mainCtrl, dappsCtrl, pm)
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
      pm.ports.length ? 60000 : 600000
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

    const currentNetwork = mainCtrl.settings.networks.filter((n) => n.id === accountOp.networkId)[0]
    // 12 seconds is the time needed for a new ethereum block
    const time = currentNetwork.reestimateOn ?? 12000
    backgroundState.reestimateInterval = setInterval(async () => {
      mainCtrl.reestimateAndUpdatePrices(accountOp.accountAddr, accountOp.networkId)
    }, time)
  }

  function debounceFrontEndEventUpdatesOnSameTick(
    ctrlName: string,
    ctrl: any,
    stateToLog: any,
    forceEmit?: boolean
  ): 'DEBOUNCED' | 'EMITTED' {
    const sendUpdate = () => {
      pm.send('> ui', { method: ctrlName, params: ctrl, forceEmit })
      logInfoWithPrefix(`onUpdate (${ctrlName} ctrl)`, parse(stringify(stateToLog)))
    }

    if (forceEmit) {
      sendUpdate()
      return 'EMITTED'
    }

    if (backgroundState.ctrlOnUpdateIsDirtyFlags[ctrlName]) return 'DEBOUNCED'
    backgroundState.ctrlOnUpdateIsDirtyFlags[ctrlName] = true

    // Debounce multiple emits in the same tick and only execute one of them
    setTimeout(() => {
      if (backgroundState.ctrlOnUpdateIsDirtyFlags[ctrlName]) {
        sendUpdate()
      }
      backgroundState.ctrlOnUpdateIsDirtyFlags[ctrlName] = false
    }, 0)

    return 'EMITTED'
  }

  /**
    Initialize the onUpdate callback for the MainController. Once the mainCtrl load is ready,
    initialize the rest of the onUpdate callbacks for the nested controllers of the main controller.
   */
  mainCtrl.onUpdate((forceEmit) => {
    const res = debounceFrontEndEventUpdatesOnSameTick('main', mainCtrl, mainCtrl, forceEmit)
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
          controller?.onUpdate(async (forceEmit?: boolean) => {
            const res = debounceFrontEndEventUpdatesOnSameTick(
              ctrlName,
              controller,
              mainCtrl,
              forceEmit
            )
            if (res === 'DEBOUNCED') return

            if (ctrlName === 'keystore') {
              if (controller.isReadyToStoreKeys) {
                if (backgroundState.isUnlocked && !controller.isUnlocked) {
                  dappsCtrl.broadcastDappSessionEvent('lock')
                } else if (!backgroundState.isUnlocked && controller.isUnlocked) {
                  dappsCtrl.broadcastDappSessionEvent('unlock')
                }
                backgroundState.isUnlocked = controller.isUnlocked
              }
            }

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
            pm.send('> ui-error', {
              method: ctrlName,
              params: { errors: (mainCtrl as any)[ctrlName].emittedErrors, controller: ctrlName }
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
    pm.send('> ui-error', {
      method: 'main',
      params: { errors: mainCtrl.emittedErrors, controller: 'main' }
    })
  })

  // Broadcast onUpdate for the wallet state controller
  walletStateCtrl.onUpdate((forceEmit) => {
    debounceFrontEndEventUpdatesOnSameTick(
      'walletState',
      walletStateCtrl,
      walletStateCtrl,
      forceEmit
    )
  })
  walletStateCtrl.onError(() => {
    pm.send('> ui-error', {
      method: 'walletState',
      params: { errors: walletStateCtrl.emittedErrors, controller: 'walletState' }
    })
  })

  // Broadcast onUpdate for the notification controller
  notificationCtrl.onUpdate((forceEmit) => {
    debounceFrontEndEventUpdatesOnSameTick(
      'notification',
      notificationCtrl,
      notificationCtrl,
      forceEmit
    )
  })
  notificationCtrl.onError(() => {
    pm.send('> ui-error', {
      method: 'notification',
      params: { errors: notificationCtrl.emittedErrors, controller: 'notification' }
    })
  })
  // Broadcast onUpdate for the notification controller
  dappsCtrl.onUpdate((forceEmit) => {
    debounceFrontEndEventUpdatesOnSameTick('dapps', dappsCtrl, dappsCtrl, forceEmit)
  })
  dappsCtrl.onError(() => {
    pm.send('> ui-error', {
      method: 'dapps',
      params: { errors: notificationCtrl.emittedErrors, controller: 'dapps' }
    })
  })

  // listen for messages from UI
  browser.runtime.onConnect.addListener(async (port: Port) => {
    if (['popup', 'tab', 'notification'].includes(port.name)) {
      // eslint-disable-next-line no-param-reassign
      port.id = nanoid()
      pm.addPort(port)
      setPortfolioFetchInterval()

      // @ts-ignore
      pm.addListener(port.id, async (messageType, { type, params }) => {
        try {
          if (messageType === '> background' && type) {
            switch (type) {
              case 'INIT_CONTROLLER_STATE': {
                if (params.controller === ('main' as any)) {
                  pm.send('> ui', { method: 'main', params: mainCtrl })
                } else if (params.controller === ('notification' as any)) {
                  pm.send('> ui', { method: 'notification', params: notificationCtrl })
                } else if (params.controller === ('walletState' as any)) {
                  pm.send('> ui', { method: 'walletState', params: walletStateCtrl })
                } else if (params.controller === ('dapps' as any)) {
                  pm.send('> ui', { method: 'dapps', params: dappsCtrl })
                } else {
                  pm.send('> ui', {
                    method: params.controller,
                    params: (mainCtrl as any)[params.controller]
                  })
                }
                break
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER': {
                if (mainCtrl.accountAdder.isInitialized) mainCtrl.accountAdder.reset()

                try {
                  // The second time a connection gets requested onwards,
                  // the Ledger device throws with "invalid channel" error.
                  // To overcome this, always make sure to clean up before starting
                  // a new session, if the device is already unlocked.
                  if (ledgerCtrl.isUnlocked()) await ledgerCtrl.cleanUp()

                  await ledgerCtrl.unlock()

                  const { walletSDK } = ledgerCtrl
                  // Should never happen
                  if (!walletSDK)
                    throw new Error('Could not establish connection with the ledger device')

                  const keyIterator = new LedgerKeyIterator({ walletSDK })
                  mainCtrl.accountAdder.init({
                    keyIterator,
                    hdPathTemplate: BIP44_LEDGER_DERIVATION_TEMPLATE
                  })

                  return await mainCtrl.accountAdder.setPage({
                    page: 1,
                    networks: mainCtrl.settings.networks,
                    providers: mainCtrl.settings.providers
                  })
                } catch (e: any) {
                  throw new Error(
                    e?.message || 'Could not unlock the Ledger device. Please try again.'
                  )
                }
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR': {
                if (mainCtrl.accountAdder.isInitialized) mainCtrl.accountAdder.reset()

                const { walletSDK } = trezorCtrl
                mainCtrl.accountAdder.init({
                  keyIterator: new TrezorKeyIterator({ walletSDK }),
                  hdPathTemplate: BIP44_STANDARD_DERIVATION_TEMPLATE
                })

                return await mainCtrl.accountAdder.setPage({
                  page: 1,
                  networks: mainCtrl.settings.networks,
                  providers: mainCtrl.settings.providers
                })
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE': {
                if (mainCtrl.accountAdder.isInitialized) mainCtrl.accountAdder.reset()

                try {
                  await latticeCtrl.unlock()

                  const { sdkSession } = latticeCtrl
                  mainCtrl.accountAdder.init({
                    keyIterator: new LatticeKeyIterator({ sdkSession }),
                    hdPathTemplate: BIP44_STANDARD_DERIVATION_TEMPLATE
                  })

                  return await mainCtrl.accountAdder.setPage({
                    page: 1,
                    networks: mainCtrl.settings.networks,
                    providers: mainCtrl.settings.providers
                  })
                } catch (e: any) {
                  throw new Error(
                    e?.message || 'Could not unlock the GridPlus device. Please try again.'
                  )
                }
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE': {
                if (mainCtrl.accountAdder.isInitialized) mainCtrl.accountAdder.reset()

                const keyIterator = new KeyIterator(params.privKeyOrSeed)
                mainCtrl.accountAdder.init({
                  keyIterator,
                  pageSize: keyIterator.subType === 'private-key' ? 1 : 5,
                  hdPathTemplate: BIP44_STANDARD_DERIVATION_TEMPLATE
                })

                return await mainCtrl.accountAdder.setPage({
                  page: 1,
                  networks: mainCtrl.settings.networks,
                  providers: mainCtrl.settings.providers
                })
              }
              case 'MAIN_CONTROLLER_ADD_CUSTOM_NETWORK': {
                return await mainCtrl.addCustomNetwork(params)
              }
              case 'MAIN_CONTROLLER_REMOVE_CUSTOM_NETWORK': {
                return await mainCtrl.removeCustomNetwork(params)
              }
              case 'SETTINGS_CONTROLLER_ADD_ACCOUNT_PREFERENCES': {
                return await mainCtrl.settings.addAccountPreferences(params)
              }
              case 'SETTINGS_CONTROLLER_SET_NETWORK_TO_ADD_OR_UPDATE': {
                return mainCtrl.settings.setNetworkToAddOrUpdate(params)
              }
              case 'SETTINGS_CONTROLLER_RESET_NETWORK_TO_ADD_OR_UPDATE': {
                return mainCtrl.settings.setNetworkToAddOrUpdate(null)
              }
              case 'MAIN_CONTROLLER_SETTINGS_ADD_KEY_PREFERENCES': {
                return await mainCtrl.settings.addKeyPreferences(params)
              }
              case 'MAIN_CONTROLLER_UPDATE_NETWORK_PREFERENCES': {
                return await mainCtrl.updateNetworkPreferences(
                  params.networkPreferences,
                  params.networkId
                )
              }
              case 'MAIN_CONTROLLER_RESET_NETWORK_PREFERENCE': {
                return await mainCtrl.resetNetworkPreference(params.preferenceKey, params.networkId)
              }
              case 'MAIN_CONTROLLER_SELECT_ACCOUNT': {
                return await mainCtrl.selectAccount(params.accountAddr)
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SELECT_ACCOUNT': {
                return mainCtrl.accountAdder.selectAccount(params.account)
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_DESELECT_ACCOUNT': {
                return await mainCtrl.accountAdder.deselectAccount(params.account)
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET_IF_NEEDED': {
                if (mainCtrl.accountAdder.isInitialized) {
                  mainCtrl.accountAdder.reset()
                }
                break
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE':
                return await mainCtrl.accountAdder.setPage({
                  ...params,
                  networks: mainCtrl.settings.networks,
                  providers: mainCtrl.settings.providers
                })
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS': {
                const readyToAddKeys: ReadyToAddKeys = {
                  internal: [],
                  external: []
                }

                if (mainCtrl.accountAdder.type === 'internal') {
                  readyToAddKeys.internal =
                    mainCtrl.accountAdder.retrieveInternalKeysOfSelectedAccounts()
                } else {
                  // External keys flow
                  const keyType = mainCtrl.accountAdder.type as ExternalKey['type']

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

                  const readyToAddExternalKeys = mainCtrl.accountAdder.selectedAccounts.flatMap(
                    ({ accountKeys, isLinked }) =>
                      accountKeys.map(({ addr, index }) => ({
                        addr,
                        type: keyType,
                        dedicatedToOneSA: !isLinked,
                        meta: {
                          deviceId: deviceIds[keyType],
                          deviceModel: deviceModels[keyType],
                          // always defined in the case of external keys
                          hdPathTemplate: mainCtrl.accountAdder
                            .hdPathTemplate as HD_PATH_TEMPLATE_TYPE,
                          index
                        }
                      }))
                  )

                  readyToAddKeys.external = readyToAddExternalKeys
                }

                const readyToAddKeyPreferences = mainCtrl.accountAdder.selectedAccounts.flatMap(
                  ({ account, accountKeys }) =>
                    accountKeys.map(({ addr }, i: number) => ({
                      addr,
                      type: mainCtrl.accountAdder.type as Key['type'],
                      label: getDefaultKeyLabel(
                        mainCtrl.keystore.keys.filter((key) =>
                          account.associatedKeys.includes(key.addr)
                        ),
                        i
                      )
                    }))
                )

                const readyToAddAccountPreferences = getDefaultAccountPreferences(
                  mainCtrl.accountAdder.selectedAccounts.map(({ account }) => account),
                  mainCtrl.accounts
                )

                return await mainCtrl.accountAdder.addAccounts(
                  mainCtrl.accountAdder.selectedAccounts,
                  readyToAddAccountPreferences,
                  readyToAddKeys,
                  readyToAddKeyPreferences
                )
              }
              case 'MAIN_CONTROLLER_ADD_VIEW_ONLY_ACCOUNTS': {
                const defaultAccountPreferences = getDefaultAccountPreferences(
                  params.accounts,
                  mainCtrl.accounts
                )

                const ensOrUdAccountPreferences: AccountPreferences = params.accounts.reduce(
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
                await mainCtrl.addAccounts(params.accounts)

                // And manually trigger some of the `onAccountAdderSuccess` steps
                // that are needed for view-only accounts, since the AccountAdder
                // flow was bypassed and the `onAccountAdderSuccess` subscription
                // in the MainController won't click.
                return await Promise.all([
                  mainCtrl.settings.addAccountPreferences({
                    ...defaultAccountPreferences,
                    ...ensOrUdAccountPreferences
                  }),
                  mainCtrl.selectAccount(params.accounts[0].addr)
                ])
              }
              // This flow interacts manually with the AccountAdder controller so that it can
              // auto pick the first smart account and import it, thus skipping the AccountAdder flow.
              case 'MAIN_CONTROLLER_ADD_SEED_PHRASE_ACCOUNT': {
                if (mainCtrl.accountAdder.isInitialized) mainCtrl.accountAdder.reset()

                const keyIterator = new KeyIterator(params.seed)

                mainCtrl.accountAdder.init({
                  keyIterator,
                  hdPathTemplate: BIP44_STANDARD_DERIVATION_TEMPLATE,
                  pageSize: 1
                })

                await mainCtrl.accountAdder.setPage({
                  page: 1,
                  networks: mainCtrl.settings.networks,
                  providers: mainCtrl.settings.providers
                })

                const firstSmartAccount = mainCtrl.accountAdder.accountsOnPage.find(
                  ({ slot, isLinked, account }) =>
                    slot === 1 && !isLinked && isSmartAccount(account)
                )?.account

                // This should never happen (added it because of typescript)
                if (!firstSmartAccount) {
                  console.error('No smart account found in the first page of the seed phrase')

                  return
                }

                await mainCtrl.accountAdder.selectAccount(firstSmartAccount)

                const readyToAddAccountPreferences = getDefaultAccountPreferences(
                  mainCtrl.accountAdder.selectedAccounts.map(({ account }) => account),
                  mainCtrl.accounts
                )

                const readyToAddKeys =
                  mainCtrl.accountAdder.retrieveInternalKeysOfSelectedAccounts()

                const readyToAddKeyPreferences = mainCtrl.accountAdder.selectedAccounts.flatMap(
                  ({ account, accountKeys }) =>
                    accountKeys.map(({ addr }, i: number) => ({
                      addr,
                      type: 'seed',
                      label: getDefaultKeyLabel(
                        mainCtrl.keystore.keys.filter((key) =>
                          account.associatedKeys.includes(key.addr)
                        ),
                        i
                      )
                    }))
                )

                return await mainCtrl.accountAdder.addAccounts(
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
                return await mainCtrl.addUserRequest(params)
              case 'MAIN_CONTROLLER_REMOVE_USER_REQUEST':
                return await mainCtrl.removeUserRequest(params.id)
              case 'MAIN_CONTROLLER_SIGN_MESSAGE_INIT':
                return mainCtrl.signMessage.init(params)
              case 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET':
                return mainCtrl.signMessage.reset()
              case 'MAIN_CONTROLLER_SIGN_MESSAGE_SIGN': {
                return await mainCtrl.signMessage.sign()
              }
              case 'MAIN_CONTROLLER_SIGN_MESSAGE_SET_SIGN_KEY':
                return mainCtrl.signMessage.setSigningKey(params.key, params.type)
              case 'MAIN_CONTROLLER_BROADCAST_SIGNED_MESSAGE':
                return await mainCtrl.broadcastSignedMessage(params.signedMessage)
              case 'MAIN_CONTROLLER_ACTIVITY_INIT':
                return mainCtrl.activity.init({
                  filters: params.filters
                })
              case 'MAIN_CONTROLLER_ACTIVITY_SET_FILTERS':
                return mainCtrl.activity.setFilters(params.filters)
              case 'MAIN_CONTROLLER_ACTIVITY_SET_ACCOUNT_OPS_PAGINATION':
                return mainCtrl.activity.setAccountsOpsPagination(params.pagination)
              case 'MAIN_CONTROLLER_ACTIVITY_SET_SIGNED_MESSAGES_PAGINATION':
                return mainCtrl.activity.setSignedMessagesPagination(params.pagination)
              case 'MAIN_CONTROLLER_ACTIVITY_RESET':
                return mainCtrl.activity.reset()

              case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE':
                return mainCtrl?.signAccountOp?.update(params)
              case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_SIGN': {
                return await mainCtrl?.signAccountOp?.sign()
              }
              case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_INIT':
                return mainCtrl.initSignAccOp(params.accountAddr, params.networkId)
              case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_DESTROY':
                return mainCtrl.destroySignAccOp()
              case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_ESTIMATE':
                return await mainCtrl.reestimateAndUpdatePrices(
                  params.accountAddr,
                  params.networkId
                )

              case 'MAIN_CONTROLLER_TRANSFER_UPDATE':
                return mainCtrl.transfer.update(params)
              case 'MAIN_CONTROLLER_TRANSFER_RESET_FORM':
                return mainCtrl.transfer.resetForm()
              case 'MAIN_CONTROLLER_TRANSFER_BUILD_USER_REQUEST':
                return await mainCtrl.transfer.buildUserRequest()
              case 'TRANSFER_CONTROLLER_CHECK_IS_RECIPIENT_ADDRESS_UNKNOWN':
                return mainCtrl.transfer.checkIsRecipientAddressUnknown()
              case 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST': {
                notificationCtrl.resolveNotificationRequest(params.data, params.id)
                break
              }
              case 'NOTIFICATION_CONTROLLER_REJECT_REQUEST': {
                notificationCtrl.rejectNotificationRequest(params.err, params.id)
                break
              }

              case 'NOTIFICATION_CONTROLLER_REOPEN_CURRENT_NOTIFICATION_REQUEST':
                return await notificationCtrl.reopenCurrentNotificationRequest()
              case 'NOTIFICATION_CONTROLLER_OPEN_NOTIFICATION_REQUEST':
                return await notificationCtrl.openNotificationRequest(params.id)

              case 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT': {
                if (!mainCtrl.selectedAccount) return
                return await mainCtrl.updateSelectedAccount(
                  mainCtrl.selectedAccount,
                  params?.forceUpdate,
                  params?.additionalHints
                )
              }

              case 'PORTFOLIO_CONTROLLER_GET_TEMPORARY_TOKENS': {
                if (!mainCtrl.selectedAccount) return

                return await mainCtrl.portfolio.getTemporaryTokens(
                  mainCtrl.selectedAccount,
                  params.networkId,
                  params.additionalHint
                )
              }
              case 'PORTFOLIO_CONTROLLER_UPDATE_TOKEN_PREFERENCES': {
                let tokenPreferences = mainCtrl?.portfolio?.tokenPreferences
                const tokenIsNotInPreferences =
                  (tokenPreferences?.length &&
                    tokenPreferences.find(
                      (_token) =>
                        _token.address.toLowerCase() === params.token.address.toLowerCase() &&
                        params.token.networkId === _token?.networkId
                    )) ||
                  false

                if (!tokenIsNotInPreferences) {
                  tokenPreferences.push(params.token)
                } else {
                  const updatedTokenPreferences = tokenPreferences.map((t: any) => {
                    if (
                      t.address.toLowerCase() === params.token.address.toLowerCase() &&
                      t.networkId === params.token.networkId
                    ) {
                      return params.token
                    }
                    return t
                  })
                  tokenPreferences = updatedTokenPreferences.filter((t) => t.isHidden || t.standard)
                }
                await mainCtrl.portfolio.updateTokenPreferences(tokenPreferences)
                return await mainCtrl.updateSelectedAccount(mainCtrl.selectedAccount, true)
              }
              case 'PORTFOLIO_CONTROLLER_REMOVE_TOKEN_PREFERENCES': {
                const tokenPreferences = mainCtrl?.portfolio?.tokenPreferences

                const tokenIsNotInPreferences =
                  tokenPreferences.find(
                    (_token) =>
                      _token.address.toLowerCase() === params.token.address.toLowerCase() &&
                      _token.networkId === params.token.networkId
                  ) || false
                if (!tokenIsNotInPreferences) return
                const newTokenPreferences = tokenPreferences.filter(
                  (_token) =>
                    _token.address.toLowerCase() !== params.token.address.toLowerCase() ||
                    _token.networkId !== params.token.networkId
                )
                await mainCtrl.portfolio.updateTokenPreferences(newTokenPreferences)
                return await mainCtrl.updateSelectedAccount(mainCtrl.selectedAccount, true)
              }
              case 'PORTFOLIO_CONTROLLER_CHECK_TOKEN': {
                if (!mainCtrl.selectedAccount) return
                return await mainCtrl.portfolio.updateTokenValidationByStandard(
                  params.token,
                  mainCtrl.selectedAccount
                )
              }
              case 'KEYSTORE_CONTROLLER_ADD_SECRET':
                return await mainCtrl.keystore.addSecret(
                  params.secretId,
                  params.secret,
                  params.extraEntropy,
                  params.leaveUnlocked
                )
              case 'KEYSTORE_CONTROLLER_UNLOCK_WITH_SECRET':
                return await mainCtrl.keystore.unlockWithSecret(params.secretId, params.secret)
              case 'KEYSTORE_CONTROLLER_LOCK':
                return mainCtrl.keystore.lock()
              case 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE':
                return mainCtrl.keystore.resetErrorState()
              case 'KEYSTORE_CONTROLLER_CHANGE_PASSWORD':
                return await mainCtrl.keystore.changeKeystorePassword(
                  params.newSecret,
                  params.secret
                )
              case 'KEYSTORE_CONTROLLER_CHANGE_PASSWORD_FROM_RECOVERY':
                // In the case we change the user's device password through the recovery process,
                // we don't know the old password, which is why we send only the new password.
                return await mainCtrl.keystore.changeKeystorePassword(params.newSecret)

              case 'EMAIL_VAULT_CONTROLLER_GET_INFO':
                return await mainCtrl.emailVault.getEmailVaultInfo(params.email)
              case 'EMAIL_VAULT_CONTROLLER_UPLOAD_KEYSTORE_SECRET':
                return await mainCtrl.emailVault.uploadKeyStoreSecret(params.email)
              case 'EMAIL_VAULT_CONTROLLER_HANDLE_MAGIC_LINK_KEY':
                return await mainCtrl.emailVault.handleMagicLinkKey(params.email)
              case 'EMAIL_VAULT_CONTROLLER_CANCEL_CONFIRMATION':
                return mainCtrl.emailVault.cancelEmailConfirmation()
              case 'EMAIL_VAULT_CONTROLLER_RECOVER_KEYSTORE':
                return await mainCtrl.emailVault.recoverKeyStore(params.email, params.newPass)
              case 'EMAIL_VAULT_CONTROLLER_CLEAN_MAGIC_AND_SESSION_KEYS':
                return await mainCtrl.emailVault.cleanMagicAndSessionKeys()
              case 'EMAIL_VAULT_CONTROLLER_REQUEST_KEYS_SYNC':
                return await mainCtrl.emailVault.requestKeysSync(params.email, params.keys)
              case 'ADDRESS_BOOK_CONTROLLER_ADD_CONTACT': {
                return await mainCtrl.addressBook.addContact(params.name, params.address)
              }
              case 'ADDRESS_BOOK_CONTROLLER_RENAME_CONTACT': {
                const { address, newName } = params

                if (
                  mainCtrl.accounts.find(({ addr }) => addr.toLowerCase() === address.toLowerCase())
                ) {
                  return await mainCtrl.settings.addAccountPreferences({
                    [address]: {
                      ...mainCtrl.settings.accountPreferences[address],
                      label: newName.trim()
                    }
                  })
                }

                return await mainCtrl.addressBook.renameManuallyAddedContact(address, newName)
              }
              case 'ADDRESS_BOOK_CONTROLLER_REMOVE_CONTACT':
                return await mainCtrl.addressBook.removeManuallyAddedContact(params.address)
              case 'DOMAINS_CONTROLLER_REVERSE_LOOKUP':
                return await mainCtrl.domains.reverseLookup(params.address)
              case 'DOMAINS_CONTROLLER_SAVE_RESOLVED_REVERSE_LOOKUP':
                return mainCtrl.domains.saveResolvedReverseLookup(params)
              case 'SET_IS_DEFAULT_WALLET': {
                walletStateCtrl.isDefaultWallet = params.isDefaultWallet
                break
              }
              case 'SET_ONBOARDING_STATE': {
                walletStateCtrl.onboardingState = params
                break
              }

              case 'DAPPS_CONTROLLER_DISCONNECT_DAPP': {
                dappsCtrl.broadcastDappSessionEvent('disconnect', undefined, params)
                dappsCtrl.updateDapp(params, { isConnected: false })
                break
              }
              case 'CHANGE_CURRENT_DAPP_NETWORK': {
                dappsCtrl.updateDapp(params.origin, { chainId: params.chainId })
                dappsCtrl.broadcastDappSessionEvent(
                  'chainChanged',
                  {
                    chain: `0x${params.chainId.toString(16)}`,
                    networkVersion: `${params.chainId}`
                  },
                  params.origin
                )
                break
              }
              case 'DAPP_CONTROLLER_ADD_DAPP': {
                return dappsCtrl.addDapp(params)
              }
              case 'DAPP_CONTROLLER_UPDATE_DAPP': {
                return dappsCtrl.updateDapp(params.url, params.dapp)
              }
              case 'DAPP_CONTROLLER_REMOVE_DAPP': {
                dappsCtrl.broadcastDappSessionEvent('disconnect', undefined, params)
                return dappsCtrl.removeDapp(params)
              }

              default:
                return console.error(
                  `Dispatched ${type} action, but handler in the extension background process not found!`
                )
            }
          }
        } catch (err: any) {
          pm.send('> ui-error', {
            method: type,
            params: {
              errors: [
                {
                  message:
                    err?.message ||
                    `Something went wrong while handling action: ${type}. Please try again! If the problem persists, please contact support`,
                  level: 'major',
                  error: err
                }
              ]
            }
          })
        }
      })

      port.onDisconnect.addListener(() => {
        pm.dispose(port.id)
        pm.removePort(port.id)
        setPortfolioFetchInterval()

        if (port.name === 'tab' || port.name === 'notification') {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          ledgerCtrl.cleanUp()
          trezorCtrl.cleanUp()
        }
      })
    }
  })

  const bridgeMessenger = initializeMessenger({ connect: 'inpage' })
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  providerRequestTransport.reply(async ({ method, id, params }, meta) => {
    const sessionId = meta.sender?.tab?.id
    if (sessionId === undefined || !meta.sender?.url) {
      return
    }

    const origin = getOriginFromUrl(meta.sender.url)
    const session = dappsCtrl.getOrCreateDappSession(sessionId, origin)
    session.setMessenger(bridgeMessenger)

    // Temporarily resolves the subscription methods as successful
    // but the rpc block subscription is actually not implemented because it causes app crashes
    if (method === 'eth_subscribe' || method === 'eth_unsubscribe') {
      return true
    }

    try {
      const res = await handleProviderRequests({
        data: {
          method,
          params
        },
        session,
        origin,
        mainCtrl,
        notificationCtrl,
        dappsCtrl
      })
      return { id, result: res }
    } catch (error: any) {
      return { id, error }
    }
  })
})()

// Open the get-started screen in a new tab right after the extension is installed.
browser.runtime.onInstalled.addListener(({ reason }: any) => {
  // It makes Puppeteer tests a bit slow (waiting the get-started tab to be loaded, switching back to the tab under the tests),
  // and we prefer to skip opening it for the testing.
  if (ENVIRONMENT === 'testing') return

  if (reason === 'install') {
    setTimeout(() => {
      const extensionURL = browser.runtime.getURL('tab.html')
      browser.tabs.create({ url: extensionURL })
    }, 500)
  }
})

// Send a browser notification when the signing process of a message or account op is finalized
const notifyForSuccessfulBroadcast = async (type: 'message' | 'typed-data' | 'account-op') => {
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

  // service_worker (mv3) - without await the notification doesn't show
  try {
    await browser.notifications.create(nanoid(), {
      type: 'basic',
      iconUrl: browser.runtime.getURL('assets/images/xicon@96.png'),
      title: 'Successfully signed',
      message
    })
  } catch (err) {
    console.warn(`Failed to register browser notification: ${err}`)
  }
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
