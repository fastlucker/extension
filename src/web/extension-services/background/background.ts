/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
import 'setimmediate'

import { nanoid } from 'nanoid'

import {
  BIP44_STANDARD_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import { MainController } from '@ambire-common/controllers/main/main'
import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import { Fetch } from '@ambire-common/interfaces/fetch'
import { ExternalKey, Key, ReadyToAddKeys } from '@ambire-common/interfaces/keystore'
import { Network, NetworkId } from '@ambire-common/interfaces/network'
import { ActiveRoute } from '@ambire-common/interfaces/swapAndBridge'
import { isDerivedForSmartAccountKeyOnly } from '@ambire-common/libs/account/account'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import { clearHumanizerMetaObjectFromStorage } from '@ambire-common/libs/humanizer'
import { KeyIterator } from '@ambire-common/libs/keyIterator/keyIterator'
import {
  getAccountKeysCount,
  getDefaultKeyLabel,
  getExistingKeyLabel
} from '@ambire-common/libs/keys/keys'
import { KeystoreSigner } from '@ambire-common/libs/keystoreSigner/keystoreSigner'
import { getNetworksWithFailedRPC } from '@ambire-common/libs/networks/networks'
import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
import {
  getActiveRoutesLowestServiceTime,
  getActiveRoutesUpdateInterval
} from '@ambire-common/libs/swapAndBridge/swapAndBridge'
import wait from '@ambire-common/utils/wait'
import { createRecurringTimeout } from '@common/utils/timeout'
import { RELAYER_URL, SOCKET_API_KEY, VELCRO_URL } from '@env'
import { browser } from '@web/constants/browserapi'
import AutoLockController from '@web/extension-services/background/controllers/auto-lock'
import { BadgesController } from '@web/extension-services/background/controllers/badges'
import { WalletStateController } from '@web/extension-services/background/controllers/wallet-state'
import { handleKeepAlive } from '@web/extension-services/background/handlers/handleKeepAlive'
import { handleRegisterScripts } from '@web/extension-services/background/handlers/handleScripting'
import handleProviderRequests from '@web/extension-services/background/provider/handleProviderRequests'
import { providerRequestTransport } from '@web/extension-services/background/provider/providerRequestTransport'
import { controllersNestedInMainMapping } from '@web/extension-services/background/types'
import { notificationManager } from '@web/extension-services/background/webapi/notification'
import { storage } from '@web/extension-services/background/webapi/storage'
import windowManager from '@web/extension-services/background/webapi/window'
import { initializeMessenger, Port, PortMessenger } from '@web/extension-services/messengers'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'
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

function stateDebug(event: string, stateToLog: object) {
  // Send the controller's state from the background to the Puppeteer testing environment for E2E test debugging.
  // Puppeteer listens for console.log events and will output the message to the CI console.
  // 💡 We need to send it as a string because Puppeteer can't parse console.log message objects.
  // 💡 `logInfoWithPrefix` wraps console.log, and we can't add a listener to it from the Puppeteer configuration.
  // That's why we use the native `console.log` method here to send the state to Puppeteer.
  if (process.env.E2E_DEBUG === 'true') {
    console.log(stringify(stateToLog))
  }

  // In production, we avoid logging the complete state because `parse(stringify(stateToLog))` can be CPU-intensive.
  // This is especially true for the main controller, which includes all sub-controller states.
  // For example, the portfolio state for a single account can exceed 2.0MB, and `parse(stringify(portfolio))`
  // can take over 100ms to execute. With multiple consecutive updates, this can add up to over a second,
  // causing the extension to slow down or freeze.
  // Instead of logging with `logInfoWithPrefix` in production, we rely on EventEmitter.emitError() to log individual errors
  // (instead of the entire state) to the user console, which aids in debugging without significant performance costs.
  if (process.env.APP_ENV === 'production') return

  logInfoWithPrefix(event, parse(stringify(stateToLog)))
}

let mainCtrl: MainController

// eslint-disable-next-line @typescript-eslint/no-floating-promises
handleRegisterScripts()
handleKeepAlive()

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  // In the testing environment, we need to slow down app initialization.
  // This is necessary to predefine the chrome.storage testing values in our Puppeteer tests,
  // ensuring that the Controllers are initialized with the storage correctly.
  // Once the storage is configured in Puppeteer, we set the `isE2EStorageSet` flag to true.
  // Here, we are waiting for its value to be set.
  if (process.env.IS_TESTING === 'true') {
    const checkE2EStorage = async (): Promise<void> => {
      const isE2EStorageSet = !!(await storage.get('isE2EStorageSet', false))

      if (isE2EStorageSet) {
        return
      }

      await wait(100)
      await checkE2EStorage()
    }

    await checkE2EStorage()
  }

  const backgroundState: {
    isUnlocked: boolean
    ctrlOnUpdateIsDirtyFlags: { [key: string]: boolean }
    accountStateIntervals: {
      pending: number
      standBy: number
      retriedFastAccountStateReFetchForNetworks: string[]
      fastAccountStateReFetchTimeout?: ReturnType<typeof setTimeout>
    }
    hasSignAccountOpCtrlInitialized: boolean
    portfolioLastUpdatedByIntervalAt: number
    updatePortfolioInterval?: ReturnType<typeof setTimeout>
    autoLockIntervalId?: ReturnType<typeof setInterval>
    accountsOpsStatusesInterval?: ReturnType<typeof setTimeout>
    updateActiveRoutesInterval?: ReturnType<typeof setTimeout>
    updateSwapAndBridgeQuoteInterval?: ReturnType<typeof setTimeout>
    gasPriceTimeout?: { start: any; stop: any }
    estimateTimeout?: { start: any; stop: any }
    accountStateLatestInterval?: ReturnType<typeof setTimeout>
    accountStatePendingInterval?: ReturnType<typeof setTimeout>
    selectedAccountStateInterval?: number
  } = {
    /**
      ctrlOnUpdateIsDirtyFlags will be set to true for a given ctrl when it receives an update in the ctrl.onUpdate callback.
      While the flag is truthy and there are new updates coming for that ctrl in the same tick, they will be debounced and only one event will be executed at the end
    */
    isUnlocked: false,
    ctrlOnUpdateIsDirtyFlags: {},
    accountStateIntervals: {
      pending: 8000,
      standBy: 300000,
      retriedFastAccountStateReFetchForNetworks: []
    },
    hasSignAccountOpCtrlInitialized: false,
    portfolioLastUpdatedByIntervalAt: Date.now() // Because the first update is immediate
  }

  const pm = new PortMessenger()
  const ledgerCtrl = new LedgerController()
  const trezorCtrl = new TrezorController()
  const latticeCtrl = new LatticeController()

  // Extension-specific additional trackings
  const fetchWithAnalytics: Fetch = (url, init) => {
    // As of v4.26.0, custom extension-specific headers. TBD for the other apps.
    const initWithCustomHeaders = init || { headers: { 'x-app-source': '' } }
    initWithCustomHeaders.headers = initWithCustomHeaders.headers || {}
    const sliceOfKeyStoreUid = mainCtrl.keystore.keyStoreUid?.substring(10, 21) || ''
    const inviteVerifiedCode = mainCtrl.invite.verifiedCode || ''
    initWithCustomHeaders.headers['x-app-source'] = sliceOfKeyStoreUid + inviteVerifiedCode

    // As of v4.36.0, for metric purposes, pass the account keys count as an
    // additional param for the batched velcro discovery requests.
    const shouldAttachKeyCountParam = url.toString().startsWith(`${VELCRO_URL}/multi-hints?`)
    if (shouldAttachKeyCountParam) {
      const urlObj = new URL(url.toString())
      const accounts = urlObj.searchParams.get('accounts')

      if (accounts) {
        const accountKeysCount = accounts.split(',').map((accountAddr) => {
          return getAccountKeysCount({
            accountAddr,
            keys: mainCtrl.keystore.keys,
            accounts: mainCtrl.accounts.accounts
          })
        })

        urlObj.searchParams.append('sigs', accountKeysCount.join(','))
        // Override the URL and replace encoded commas (%2C) with actual commas
        // eslint-disable-next-line no-param-reassign
        url = urlObj.toString().replace(/%2C/g, ',')
      }
    }

    // Use the native fetch (instead of node-fetch or whatever else) since
    // browser extensions are designed to run within the web environment,
    // which already provides a native and well-optimized fetch API.
    return fetch(url, initWithCustomHeaders)
  }

  mainCtrl = new MainController({
    storage,
    fetch: fetchWithAnalytics,
    relayerUrl: RELAYER_URL,
    velcroUrl: VELCRO_URL,
    socketApiKey: SOCKET_API_KEY,
    keystoreSigners: {
      internal: KeystoreSigner,
      // TODO: there is a mismatch in hw signer types, it's not a big deal
      ledger: LedgerSigner,
      trezor: TrezorSigner,
      lattice: LatticeSigner
    } as any,
    externalSignerControllers: {
      ledger: ledgerCtrl,
      trezor: trezorCtrl,
      lattice: latticeCtrl
    } as any,
    windowManager: {
      ...windowManager,
      sendWindowToastMessage: (text, options) => {
        pm.send('> ui-toast', { method: 'addToast', params: { text, options } })
      }
    },
    notificationManager
  })
  const walletStateCtrl = new WalletStateController()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const badgesCtrl = new BadgesController(mainCtrl)
  const autoLockCtrl = new AutoLockController(() => mainCtrl.keystore.lock())

  const ACTIVE_EXTENSION_PORTFOLIO_UPDATE_INTERVAL = 60000
  const INACTIVE_EXTENSION_PORTFOLIO_UPDATE_INTERVAL = 600000
  async function initPortfolioContinuousUpdate() {
    if (backgroundState.updatePortfolioInterval)
      clearTimeout(backgroundState.updatePortfolioInterval)

    const isExtensionActive = pm.ports.length > 0 // (opened tab, popup, action-window)
    const updateInterval = isExtensionActive
      ? ACTIVE_EXTENSION_PORTFOLIO_UPDATE_INTERVAL
      : INACTIVE_EXTENSION_PORTFOLIO_UPDATE_INTERVAL

    async function updatePortfolio() {
      const hasBroadcastedButNotConfirmed = !!mainCtrl.activity.broadcastedButNotConfirmed.length

      // Postpone the portfolio update for the next interval
      // if we have broadcasted but not yet confirmed acc op.
      // Here's why:
      // 1. On the Dashboard, we show a pending-to-be-confirmed token badge
      //    if an acc op has been broadcasted but is still unconfirmed.
      // 2. To display the expected balance change, we calculate it from the portfolio's pending simulation state.
      // 3. When we sign and broadcast the acc op, we remove it from the Main controller.
      // 4. If we trigger a portfolio update at this point, we will lose the pending simulation state.
      // 5. Therefore, to ensure the badge is displayed, we pause the portfolio update temporarily.
      //    Once the acc op is confirmed or failed, the portfolio interval will resume as normal.
      // 6. Gotcha: If the user forcefully updates the portfolio, we will also lose the simulation.
      //    However, this is not a frequent case, and we can make a compromise here.
      if (hasBroadcastedButNotConfirmed) {
        backgroundState.updatePortfolioInterval = setTimeout(updatePortfolio, updateInterval)
        return
      }

      await mainCtrl.updateSelectedAccountPortfolio()

      backgroundState.portfolioLastUpdatedByIntervalAt = Date.now()
      // Schedule the next update only when the previous one completes
      backgroundState.updatePortfolioInterval = setTimeout(updatePortfolio, updateInterval)
    }

    const isAtLeastOnePortfolioUpdateMissed =
      Date.now() - backgroundState.portfolioLastUpdatedByIntervalAt >
      INACTIVE_EXTENSION_PORTFOLIO_UPDATE_INTERVAL

    // If the extension is inactive and the last update was missed, update the portfolio immediately
    if (isAtLeastOnePortfolioUpdateMissed) {
      clearTimeout(backgroundState.updatePortfolioInterval)
      await updatePortfolio()
    } else {
      // Start the first update
      backgroundState.updatePortfolioInterval = setTimeout(updatePortfolio, updateInterval)
    }
  }

  function initAccountsOpsStatusesContinuousUpdate(updateInterval: number) {
    if (backgroundState.accountsOpsStatusesInterval)
      clearTimeout(backgroundState.accountsOpsStatusesInterval)

    async function updateStatuses() {
      await mainCtrl.updateAccountsOpsStatuses()

      // Schedule the next update only when the previous one completes
      backgroundState.accountsOpsStatusesInterval = setTimeout(updateStatuses, updateInterval)
    }

    backgroundState.accountsOpsStatusesInterval = setTimeout(updateStatuses, updateInterval)
  }

  function initActiveRoutesContinuousUpdate(activeRoutesInProgress?: ActiveRoute[]) {
    if (!activeRoutesInProgress || !activeRoutesInProgress.length) {
      !!backgroundState.updateActiveRoutesInterval &&
        clearTimeout(backgroundState.updateActiveRoutesInterval)
      delete backgroundState.updateActiveRoutesInterval
      return
    }
    if (backgroundState.updateActiveRoutesInterval) return

    let minServiceTime = getActiveRoutesLowestServiceTime(activeRoutesInProgress)

    async function updateActiveRoutes() {
      minServiceTime = getActiveRoutesLowestServiceTime(activeRoutesInProgress!)
      await mainCtrl.swapAndBridge.checkForNextUserTxForActiveRoutes()

      // Schedule the next update only when the previous one completes
      backgroundState.updateActiveRoutesInterval = setTimeout(
        updateActiveRoutes,
        getActiveRoutesUpdateInterval(minServiceTime)
      )
    }

    backgroundState.updateActiveRoutesInterval = setTimeout(
      updateActiveRoutes,
      getActiveRoutesUpdateInterval(minServiceTime)
    )
  }

  function initSwapAndBridgeQuoteContinuousUpdate() {
    if (mainCtrl.swapAndBridge.formStatus !== SwapAndBridgeFormStatus.ReadyToSubmit) {
      !!backgroundState.updateSwapAndBridgeQuoteInterval &&
        clearTimeout(backgroundState.updateSwapAndBridgeQuoteInterval)
      delete backgroundState.updateSwapAndBridgeQuoteInterval
      return
    }
    if (backgroundState.updateSwapAndBridgeQuoteInterval) return

    async function updateSwapAndBridgeQuote() {
      if (mainCtrl.swapAndBridge.formStatus === SwapAndBridgeFormStatus.ReadyToSubmit)
        await mainCtrl.swapAndBridge.updateQuote({
          skipPreviousQuoteRemoval: true,
          skipQuoteUpdateOnSameValues: false,
          skipStatusUpdate: true
        })

      // Schedule the next update only when the previous one completes
      backgroundState.updateSwapAndBridgeQuoteInterval = setTimeout(updateSwapAndBridgeQuote, 60000)
    }

    backgroundState.updateSwapAndBridgeQuoteInterval = setTimeout(updateSwapAndBridgeQuote, 60000)
  }

  async function initLatestAccountStateContinuousUpdate(intervalLength: number) {
    if (backgroundState.accountStateLatestInterval)
      clearTimeout(backgroundState.accountStateLatestInterval)

    const updateAccountState = async () => {
      await mainCtrl.accounts.updateAccountStates('latest')
      backgroundState.accountStateLatestInterval = setTimeout(updateAccountState, intervalLength)
    }

    // Start the first update
    backgroundState.accountStateLatestInterval = setTimeout(updateAccountState, intervalLength)
  }

  async function initPendingAccountStateContinuousUpdate(intervalLength: number) {
    if (backgroundState.accountStatePendingInterval)
      clearTimeout(backgroundState.accountStatePendingInterval)

    const networksToUpdate = mainCtrl.activity.broadcastedButNotConfirmed
      .map((op) => op.networkId)
      .filter((networkId, index, self) => self.indexOf(networkId) === index)
    await mainCtrl.accounts.updateAccountStates('pending', networksToUpdate)

    const updateAccountState = async (networkIds: NetworkId[]) => {
      await mainCtrl.accounts.updateAccountStates('pending', networkIds)

      // if there are no more broadcastedButNotConfirmed ops for the network,
      // remove the timeout
      const networksToUpdate = mainCtrl.activity.broadcastedButNotConfirmed
        .map((op) => op.networkId)
        .filter((networkId, index, self) => self.indexOf(networkId) === index)
      if (!networksToUpdate.length) {
        clearTimeout(backgroundState.accountStatePendingInterval)
      } else {
        // Schedule the next update
        backgroundState.accountStatePendingInterval = setTimeout(
          () => updateAccountState(networksToUpdate),
          intervalLength
        )
      }
    }

    // Start the first update
    backgroundState.accountStatePendingInterval = setTimeout(
      () => updateAccountState(networksToUpdate),
      intervalLength / 2
    )
  }

  function createGasPriceRecurringTimeout(accountOp: AccountOp) {
    const currentNetwork = mainCtrl.networks.networks.filter((n) => n.id === accountOp.networkId)[0]
    // 12 seconds is the time needed for a new ethereum block
    const time = currentNetwork.reestimateOn ?? 12000

    return createRecurringTimeout(() => mainCtrl.updateSignAccountOpGasPrice(), time)
  }

  function createEstimateRecurringTimeout() {
    return createRecurringTimeout(() => mainCtrl.estimateSignAccountOp(), 60000)
  }

  function debounceFrontEndEventUpdatesOnSameTick(
    ctrlName: string,
    ctrl: any,
    stateToLog: any,
    forceEmit?: boolean
  ): 'DEBOUNCED' | 'EMITTED' {
    const sendUpdate = () => {
      pm.send('> ui', {
        method: ctrlName,
        // We are removing the portfolio to avoid the CPU-intensive task of parsing + stringifying.
        // The portfolio controller is particularly resource-heavy. Additionally, we should access the portfolio
        // directly from its contexts instead of through the main, which applies to other nested controllers as well.
        // Keep in mind: if we just spread `ctrl` instead of calling `ctrl.toJSON()`, the getters won't be included.
        params: ctrlName === 'main' ? { ...ctrl.toJSON(), portfolio: null } : ctrl,
        forceEmit
      })
      stateDebug(`onUpdate (${ctrlName} ctrl)`, stateToLog)
    }

    /**
     * Bypasses both background and React batching,
     * ensuring that the state update is immediately applied at the application level (React/Extension).
     *
     * For more info, please refer to:
     * EventEmitter.forceEmitUpdate() or useControllerState().
     */
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
      if (mainCtrl.signAccountOp) {
        backgroundState.gasPriceTimeout && backgroundState.gasPriceTimeout.stop()
        backgroundState.estimateTimeout && backgroundState.estimateTimeout.stop()

        backgroundState.gasPriceTimeout = createGasPriceRecurringTimeout(
          mainCtrl.signAccountOp.accountOp
        )
        backgroundState.gasPriceTimeout.start()

        backgroundState.estimateTimeout = createEstimateRecurringTimeout()
        backgroundState.estimateTimeout.start()
      } else {
        backgroundState.gasPriceTimeout && backgroundState.gasPriceTimeout.stop()
        backgroundState.estimateTimeout && backgroundState.estimateTimeout.stop()
      }

      backgroundState.hasSignAccountOpCtrlInitialized = !!mainCtrl.signAccountOp
    }

    if (mainCtrl.statuses.broadcastSignedAccountOp === 'SUCCESS') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      initPendingAccountStateContinuousUpdate(backgroundState.accountStateIntervals.pending)
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
                  mainCtrl.dapps.broadcastDappSessionEvent('lock')
                } else if (!backgroundState.isUnlocked && controller.isUnlocked) {
                  mainCtrl.dapps.broadcastDappSessionEvent('unlock', [
                    mainCtrl.accounts.selectedAccount
                  ])
                }
                backgroundState.isUnlocked = controller.isUnlocked
              }
            }

            if (ctrlName === 'activity') {
              // Start the interval for updating the accounts ops statuses, only if there are broadcasted but not confirmed accounts ops
              if (controller?.broadcastedButNotConfirmed.length) {
                // If the interval is already set, then do nothing.
                if (!backgroundState.accountsOpsStatusesInterval) {
                  initAccountsOpsStatusesContinuousUpdate(5000)
                }
              } else {
                !!backgroundState.accountsOpsStatusesInterval &&
                  clearTimeout(backgroundState.accountsOpsStatusesInterval)
                delete backgroundState.accountsOpsStatusesInterval
              }
            }
            if (ctrlName === 'accounts') {
              const failedNetworkIds = getNetworksWithFailedRPC({
                providers: mainCtrl.providers.providers
              })

              const retriedFastAccountStateReFetchForNetworks =
                backgroundState.accountStateIntervals.retriedFastAccountStateReFetchForNetworks

              // Delete the network ids that have been successfully re-fetched so the logic can be re-applied
              // if the RPC goes down again
              if (retriedFastAccountStateReFetchForNetworks.length) {
                retriedFastAccountStateReFetchForNetworks.forEach((networkId, index) => {
                  if (!failedNetworkIds.includes(networkId)) {
                    delete retriedFastAccountStateReFetchForNetworks[index]
                  }
                })
              }

              if (failedNetworkIds.length) {
                // Filter out the network ids that have already been retried (update them with the regular interval)
                const filteredNetworkIds = failedNetworkIds.filter(
                  (id) =>
                    !backgroundState.accountStateIntervals.retriedFastAccountStateReFetchForNetworks.find(
                      (networkId) => networkId === id
                    )
                )

                if (filteredNetworkIds.length) {
                  if (backgroundState.accountStateIntervals.fastAccountStateReFetchTimeout) {
                    clearTimeout(
                      backgroundState.accountStateIntervals.fastAccountStateReFetchTimeout
                    )
                  }

                  backgroundState.accountStateIntervals.fastAccountStateReFetchTimeout = setTimeout(
                    async () => {
                      await mainCtrl.accounts.updateAccountStates('latest', filteredNetworkIds)

                      // Add the network ids that have been retried to the list
                      failedNetworkIds.forEach((id) => {
                        retriedFastAccountStateReFetchForNetworks.push(id)
                      })
                    },
                    8000
                  )
                }
              }
            }
            if (ctrlName === 'swapAndBridge') {
              initActiveRoutesContinuousUpdate(controller?.activeRoutesInProgress)
              initSwapAndBridgeQuoteContinuousUpdate()
            }
          }, 'background')
        }
      }

      if (Array.isArray(controller?.onErrorIds)) {
        const hasOnErrorInitialized = controller.onErrorIds.includes('background')

        if (!hasOnErrorInitialized) {
          ;(mainCtrl as any)[ctrlName]?.onError(() => {
            stateDebug(`onError (${ctrlName} ctrl)`, mainCtrl)
            pm.send('> ui-error', {
              method: ctrlName,
              params: { errors: (mainCtrl as any)[ctrlName].emittedErrors, controller: ctrlName }
            })
          }, 'background')
        }
      }
    })
  }, 'background')
  mainCtrl.onError(() => {
    stateDebug('onError (main ctrl)', mainCtrl)
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

  // Broadcast onUpdate for the auto-lock controller
  autoLockCtrl.onUpdate((forceEmit) => {
    debounceFrontEndEventUpdatesOnSameTick('autoLock', autoLockCtrl, autoLockCtrl, forceEmit)
  })
  autoLockCtrl.onError(() => {
    pm.send('> ui-error', {
      method: 'autoLock',
      params: { errors: autoLockCtrl.emittedErrors, controller: 'autoLock' }
    })
  })

  // listen for messages from UI
  browser.runtime.onConnect.addListener(async (port: Port) => {
    if (['popup', 'tab', 'action-window'].includes(port.name)) {
      // eslint-disable-next-line no-param-reassign
      port.id = nanoid()
      pm.addPort(port)
      const hasBroadcastedButNotConfirmed = !!mainCtrl.activity.broadcastedButNotConfirmed.length

      const timeSinceLastUpdate =
        Date.now() - (backgroundState.portfolioLastUpdatedByIntervalAt || 0)

      // Call portfolio update if the extension is inactive and 30 seconds have passed since the last update
      // in order to have the latest data when the user opens the extension
      // otherwise, the portfolio will be updated by the interval after 1 minute
      // and there is no broadcasted but not confirmed acc op, due to the fact that this will cost it being
      // removed from the UI and we will lose the simulation
      // Also do not trigger update on every new port but only if there is only one port
      if (
        timeSinceLastUpdate > ACTIVE_EXTENSION_PORTFOLIO_UPDATE_INTERVAL / 2 &&
        pm.ports.length === 1 &&
        port.name === 'popup' &&
        !hasBroadcastedButNotConfirmed
      ) {
        try {
          await mainCtrl.updateSelectedAccountPortfolio()
          backgroundState.portfolioLastUpdatedByIntervalAt = Date.now()
        } catch (error) {
          console.error('Error during immediate portfolio update:', error)
        }
      }

      initPortfolioContinuousUpdate()

      // @ts-ignore
      pm.addListener(port.id, async (messageType, { type, params }) => {
        try {
          if (messageType === '> background' && type) {
            switch (type) {
              case 'INIT_CONTROLLER_STATE': {
                if (params.controller === ('main' as any)) {
                  pm.send('> ui', { method: 'main', params: mainCtrl })
                } else if (params.controller === ('walletState' as any)) {
                  pm.send('> ui', { method: 'walletState', params: walletStateCtrl })
                } else if (params.controller === ('autoLock' as any)) {
                  pm.send('> ui', { method: 'autoLock', params: autoLockCtrl })
                } else {
                  pm.send('> ui', {
                    method: params.controller,
                    params: (mainCtrl as any)[params.controller]
                  })
                }
                break
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER': {
                return await mainCtrl.handleAccountAdderInitLedger(LedgerKeyIterator)
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR': {
                if (mainCtrl.accountAdder.isInitialized) mainCtrl.accountAdder.reset()

                const { walletSDK } = trezorCtrl
                await mainCtrl.accountAdder.init({
                  keyIterator: new TrezorKeyIterator({ walletSDK }),
                  hdPathTemplate: BIP44_STANDARD_DERIVATION_TEMPLATE
                })

                return await mainCtrl.accountAdder.setPage({ page: 1 })
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE': {
                return await mainCtrl.handleAccountAdderInitLattice(LatticeKeyIterator)
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE': {
                if (mainCtrl.accountAdder.isInitialized) mainCtrl.accountAdder.reset()

                const hdPathTemplate = BIP44_STANDARD_DERIVATION_TEMPLATE
                const keyIterator = new KeyIterator(params.privKeyOrSeed)
                if (keyIterator.subType === 'seed' && params.shouldPersist) {
                  await mainCtrl.keystore.addSeed({ seed: params.privKeyOrSeed, hdPathTemplate })
                }

                await mainCtrl.accountAdder.init({
                  keyIterator,
                  pageSize: keyIterator.subType === 'private-key' ? 1 : 5,
                  hdPathTemplate
                })

                return await mainCtrl.accountAdder.setPage({ page: 1 })
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_FROM_DEFAULT_SEED_PHRASE': {
                if (mainCtrl.accountAdder.isInitialized) mainCtrl.accountAdder.reset()
                const keystoreDefaultSeed = await mainCtrl.keystore.getDefaultSeed()

                if (!keystoreDefaultSeed) return
                const keyIterator = new KeyIterator(keystoreDefaultSeed.seed)
                await mainCtrl.accountAdder.init({
                  keyIterator,
                  pageSize: 5,
                  hdPathTemplate: keystoreDefaultSeed.hdPathTemplate
                })

                return await mainCtrl.accountAdder.setPage({ page: 1 })
              }
              case 'MAIN_CONTROLLER_TRACE_CALL': {
                return await mainCtrl.traceCall(params.estimation)
              }
              case 'MAIN_CONTROLLER_ADD_NETWORK': {
                return await mainCtrl.addNetwork(params)
              }
              case 'MAIN_CONTROLLER_REMOVE_NETWORK': {
                return await mainCtrl.removeNetwork(params)
              }
              case 'ACCOUNTS_CONTROLLER_UPDATE_ACCOUNT_PREFERENCES': {
                return await mainCtrl.accounts.updateAccountPreferences(params)
              }
              case 'SETTINGS_CONTROLLER_SET_NETWORK_TO_ADD_OR_UPDATE': {
                return await mainCtrl.networks.setNetworkToAddOrUpdate(params)
              }
              case 'SETTINGS_CONTROLLER_RESET_NETWORK_TO_ADD_OR_UPDATE': {
                return await mainCtrl.networks.setNetworkToAddOrUpdate(null)
              }
              case 'KEYSTORE_CONTROLLER_UPDATE_KEY_PREFERENCES': {
                return await mainCtrl.keystore.updateKeyPreferences(params)
              }
              case 'MAIN_CONTROLLER_UPDATE_NETWORK': {
                return await mainCtrl.networks.updateNetwork(params.network, params.networkId)
              }
              case 'MAIN_CONTROLLER_SELECT_ACCOUNT': {
                return await mainCtrl.accounts.selectAccount(params.accountAddr)
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SELECT_ACCOUNT': {
                return mainCtrl.accountAdder.selectAccount(params.account)
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_DESELECT_ACCOUNT': {
                return mainCtrl.accountAdder.deselectAccount(params.account)
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET_IF_NEEDED': {
                if (mainCtrl.accountAdder.isInitialized) {
                  mainCtrl.accountAdder.reset()
                }
                break
              }
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE':
                return await mainCtrl.accountAdder.setPage(params)
              case 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_HD_PATH_TEMPLATE': {
                return await mainCtrl.accountAdder.setHDPathTemplate(params)
              }
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
                    ({ account, accountKeys }) =>
                      accountKeys.map(({ addr, index }, i) => ({
                        addr,
                        type: keyType,
                        label: `${
                          HARDWARE_WALLET_DEVICE_NAMES[mainCtrl.accountAdder.type as Key['type']]
                        } ${
                          getExistingKeyLabel(
                            mainCtrl.keystore.keys,
                            addr,
                            mainCtrl.accountAdder.type as Key['type']
                          ) ||
                          getDefaultKeyLabel(
                            mainCtrl.keystore.keys.filter((key) =>
                              account.associatedKeys.includes(key.addr)
                            ),
                            i
                          )
                        }`,
                        dedicatedToOneSA: isDerivedForSmartAccountKeyOnly(index),
                        meta: {
                          deviceId: deviceIds[keyType],
                          deviceModel: deviceModels[keyType],
                          // always defined in the case of external keys
                          hdPathTemplate: mainCtrl.accountAdder
                            .hdPathTemplate as HD_PATH_TEMPLATE_TYPE,
                          index,
                          createdAt: new Date().getTime()
                        }
                      }))
                  )

                  readyToAddKeys.external = readyToAddExternalKeys
                }

                return await mainCtrl.accountAdder.addAccounts(
                  mainCtrl.accountAdder.selectedAccounts,
                  readyToAddKeys
                )
              }
              case 'MAIN_CONTROLLER_ADD_VIEW_ONLY_ACCOUNTS': {
                // Since these accounts are view-only, directly add them in the
                // MainController, bypassing the AccountAdder flow.
                await mainCtrl.accounts.addAccounts(params.accounts)
                break
              }
              // This flow interacts manually with the AccountAdder controller so that it can
              // auto pick the first smart account and import it, thus skipping the AccountAdder flow.
              case 'CREATE_NEW_SEED_PHRASE_AND_ADD_FIRST_SMART_ACCOUNT': {
                await mainCtrl.importSmartAccountFromDefaultSeed(params.seed)
                break
              }
              case 'ADD_NEXT_SMART_ACCOUNT_FROM_DEFAULT_SEED_PHRASE': {
                await mainCtrl.importSmartAccountFromDefaultSeed()
                break
              }
              case 'MAIN_CONTROLLER_REMOVE_ACCOUNT': {
                return await mainCtrl.removeAccount(params.accountAddr)
              }
              case 'MAIN_CONTROLLER_BUILD_TRANSFER_USER_REQUEST':
                return await mainCtrl.buildTransferUserRequest(
                  params.amount,
                  params.recipientAddress,
                  params.selectedToken,
                  params.executionType
                )
              case 'MAIN_CONTROLLER_ADD_USER_REQUEST':
                return await mainCtrl.addUserRequest(params)
              case 'MAIN_CONTROLLER_REMOVE_USER_REQUEST':
                return mainCtrl.removeUserRequest(params.id)
              case 'MAIN_CONTROLLER_RESOLVE_USER_REQUEST':
                return mainCtrl.resolveUserRequest(params.data, params.id)
              case 'MAIN_CONTROLLER_REJECT_USER_REQUEST':
                return mainCtrl.rejectUserRequest(params.err, params.id)
              case 'MAIN_CONTROLLER_RESOLVE_ACCOUNT_OP':
                return await mainCtrl.resolveAccountOpAction(params.data, params.actionId)
              case 'MAIN_CONTROLLER_REJECT_ACCOUNT_OP':
                return mainCtrl.rejectAccountOpAction(
                  params.err,
                  params.actionId,
                  params.shouldOpenNextAction
                )
              case 'MAIN_CONTROLLER_SIGN_MESSAGE_INIT': {
                return await mainCtrl.signMessage.init(params)
              }
              case 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET':
                return mainCtrl.signMessage.reset()
              case 'MAIN_CONTROLLER_HANDLE_SIGN_MESSAGE': {
                mainCtrl.signMessage.setSigningKey(params.keyAddr, params.keyType)
                return await mainCtrl.handleSignMessage()
              }
              case 'MAIN_CONTROLLER_ACTIVITY_INIT':
                return mainCtrl.activity.init(params?.filters)
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
              case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE_STATUS':
                return mainCtrl?.signAccountOp?.updateStatus(params.status)
              case 'MAIN_CONTROLLER_HANDLE_SIGN_AND_BROADCAST_ACCOUNT_OP': {
                return await mainCtrl.handleSignAndBroadcastAccountOp()
              }
              case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_INIT':
                return mainCtrl.initSignAccOp(params.actionId)
              case 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_DESTROY':
                return mainCtrl.destroySignAccOp()

              case 'SWAP_AND_BRIDGE_CONTROLLER_INIT_FORM':
                return await mainCtrl.swapAndBridge.initForm(params.sessionId)
              case 'SWAP_AND_BRIDGE_CONTROLLER_UNLOAD_SCREEN':
                return mainCtrl.swapAndBridge.unloadScreen(params.sessionId)
              case 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM':
                return mainCtrl.swapAndBridge.updateForm(params)
              case 'SWAP_AND_BRIDGE_CONTROLLER_SWITCH_FROM_AND_TO_TOKENS':
                return await mainCtrl.swapAndBridge.switchFromAndToTokens()
              case 'SWAP_AND_BRIDGE_CONTROLLER_SELECT_ROUTE':
                return mainCtrl.swapAndBridge.selectRoute(params.route)
              case 'SWAP_AND_BRIDGE_CONTROLLER_SUBMIT_FORM':
                return await mainCtrl.buildSwapAndBridgeUserRequest()
              case 'SWAP_AND_BRIDGE_CONTROLLER_ACTIVE_ROUTE_BUILD_NEXT_USER_REQUEST':
                return await mainCtrl.buildSwapAndBridgeUserRequest(params.activeRouteId)
              case 'SWAP_AND_BRIDGE_CONTROLLER_REMOVE_ACTIVE_ROUTE':
                return mainCtrl.swapAndBridge.removeActiveRoute(params.activeRouteId)
              case 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_PORTFOLIO_TOKEN_LIST':
                return mainCtrl.swapAndBridge.updatePortfolioTokenList(params)

              case 'ACTIONS_CONTROLLER_ADD_TO_ACTIONS_QUEUE':
                return mainCtrl.actions.addOrUpdateAction(params)
              case 'ACTIONS_CONTROLLER_REMOVE_FROM_ACTIONS_QUEUE':
                return mainCtrl.actions.removeAction(params.id, params.shouldOpenNextAction)
              case 'ACTIONS_CONTROLLER_FOCUS_ACTION_WINDOW':
                return mainCtrl.actions.focusActionWindow()
              case 'ACTIONS_CONTROLLER_SET_CURRENT_ACTION_BY_ID':
                return mainCtrl.actions.setCurrentActionById(params.actionId)
              case 'ACTIONS_CONTROLLER_SET_CURRENT_ACTION_BY_INDEX':
                return mainCtrl.actions.setCurrentActionByIndex(params.index)
              case 'ACTIONS_CONTROLLER_SET_WINDOW_LOADED':
                return mainCtrl.actions.setWindowLoaded()

              case 'MAIN_CONTROLLER_RELOAD_SELECTED_ACCOUNT': {
                return await mainCtrl.reloadSelectedAccount()
              }

              case 'PORTFOLIO_CONTROLLER_GET_TEMPORARY_TOKENS': {
                if (!mainCtrl.accounts.selectedAccount) return

                return await mainCtrl.portfolio.getTemporaryTokens(
                  mainCtrl.accounts.selectedAccount,
                  params.networkId,
                  params.additionalHint
                )
              }
              case 'PORTFOLIO_CONTROLLER_UPDATE_TOKEN_PREFERENCES': {
                const token = params.token
                let tokenPreferences = mainCtrl?.portfolio?.tokenPreferences
                const tokenIsNotInPreferences =
                  (tokenPreferences?.length &&
                    tokenPreferences.find(
                      (_token) =>
                        _token.address.toLowerCase() === token.address.toLowerCase() &&
                        params.token.networkId === _token?.networkId
                    )) ||
                  false

                if (!tokenIsNotInPreferences) {
                  tokenPreferences.push(token)
                } else {
                  const updatedTokenPreferences = tokenPreferences.map((t: any) => {
                    if (
                      t.address.toLowerCase() === token.address.toLowerCase() &&
                      t.networkId === token.networkId
                    ) {
                      return params.token
                    }
                    return t
                  })
                  tokenPreferences = updatedTokenPreferences.filter((t) => t.isHidden || t.standard)
                }
                const tokenNetwork: Network | undefined = mainCtrl.networks.networks.find(
                  (n) => n.id === token.networkId
                )

                await mainCtrl.portfolio.updateTokenPreferences(tokenPreferences)
                return await mainCtrl.portfolio.updateSelectedAccount(
                  mainCtrl.accounts.selectedAccount || '',
                  tokenNetwork,
                  undefined,
                  {
                    forceUpdate: true
                  }
                )
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

                const tokenNetwork: Network | undefined = mainCtrl.networks.networks.find(
                  (n) => n.id === params.token.networkId
                )

                await mainCtrl.portfolio.updateTokenPreferences(newTokenPreferences)
                return await mainCtrl.portfolio.updateSelectedAccount(
                  mainCtrl.accounts.selectedAccount || '',
                  tokenNetwork,
                  undefined,
                  {
                    forceUpdate: true
                  }
                )
              }
              case 'PORTFOLIO_CONTROLLER_CHECK_TOKEN': {
                if (!mainCtrl.accounts.selectedAccount) return
                return await mainCtrl.portfolio.updateTokenValidationByStandard(
                  params.token,
                  mainCtrl.accounts.selectedAccount
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

                const account = mainCtrl.accounts.accounts.find(
                  ({ addr }) => addr.toLowerCase() === address.toLowerCase()
                )

                if (!account) {
                  await mainCtrl.addressBook.renameManuallyAddedContact(address, newName)
                  return
                }

                return await mainCtrl.accounts.updateAccountPreferences([
                  {
                    addr: address,
                    preferences: {
                      pfp: account.preferences.pfp,
                      label: newName
                    }
                  }
                ])
              }
              case 'ADDRESS_BOOK_CONTROLLER_REMOVE_CONTACT':
                return await mainCtrl.addressBook.removeManuallyAddedContact(params.address)
              case 'DOMAINS_CONTROLLER_REVERSE_LOOKUP':
                return await mainCtrl.domains.reverseLookup(params.address)
              case 'DOMAINS_CONTROLLER_SAVE_RESOLVED_REVERSE_LOOKUP':
                return mainCtrl.domains.saveResolvedReverseLookup(params)
              case 'SET_IS_DEFAULT_WALLET': {
                return await walletStateCtrl.setDefaultWallet(params.isDefaultWallet)
              }
              case 'SET_ONBOARDING_STATE': {
                walletStateCtrl.onboardingState = params
                break
              }
              case 'SET_IS_PINNED': {
                walletStateCtrl.isPinned = params.isPinned
                break
              }
              case 'SET_IS_SETUP_COMPLETE': {
                walletStateCtrl.isSetupComplete = params.isSetupComplete
                break
              }
              case 'AUTO_LOCK_CONTROLLER_SET_LAST_ACTIVE_TIME': {
                autoLockCtrl.setLastActiveTime()
                break
              }
              case 'AUTO_LOCK_CONTROLLER_SET_AUTO_LOCK_TIME': {
                autoLockCtrl.autoLockTime = params
                break
              }

              case 'INVITE_CONTROLLER_VERIFY': {
                return await mainCtrl.invite.verify(params.code)
              }

              case 'DAPPS_CONTROLLER_DISCONNECT_DAPP': {
                mainCtrl.dapps.broadcastDappSessionEvent('disconnect', undefined, params)
                mainCtrl.dapps.updateDapp(params, { isConnected: false })
                break
              }
              case 'CHANGE_CURRENT_DAPP_NETWORK': {
                mainCtrl.dapps.updateDapp(params.origin, { chainId: params.chainId })
                mainCtrl.dapps.broadcastDappSessionEvent(
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
                return mainCtrl.dapps.addDapp(params)
              }
              case 'DAPP_CONTROLLER_UPDATE_DAPP': {
                return mainCtrl.dapps.updateDapp(params.url, params.dapp)
              }
              case 'DAPP_CONTROLLER_REMOVE_DAPP': {
                mainCtrl.dapps.broadcastDappSessionEvent('disconnect', undefined, params)
                return mainCtrl.dapps.removeDapp(params)
              }

              default:
                return console.error(
                  `Dispatched ${type} action, but handler in the extension background process not found!`
                )
            }
          }
        } catch (err: any) {
          console.error(err)
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
        initPortfolioContinuousUpdate()

        if (port.name === 'tab' || port.name === 'action-window') {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          ledgerCtrl.cleanUp()
          trezorCtrl.cleanUp()
        }
      })
    }
  })

  initPortfolioContinuousUpdate()
  await initLatestAccountStateContinuousUpdate(backgroundState.accountStateIntervals.standBy)
  await clearHumanizerMetaObjectFromStorage(storage)
})()

const bridgeMessenger = initializeMessenger({ connect: 'inpage' })
// eslint-disable-next-line @typescript-eslint/no-floating-promises
providerRequestTransport.reply(async ({ method, id, params }, meta) => {
  // wait for mainCtrl to be initialized before handling dapp requests
  while (!mainCtrl) {
    // eslint-disable-next-line no-await-in-loop
    await wait(200)
  }
  const sessionId = meta.sender?.tab?.id
  if (sessionId === undefined || !meta.sender?.url) {
    return
  }

  const origin = getOriginFromUrl(meta.sender.url)
  const session = mainCtrl.dapps.getOrCreateDappSession(sessionId, origin)
  session.setMessenger(bridgeMessenger)

  // Temporarily resolves the subscription methods as successful
  // but the rpc block subscription is actually not implemented because it causes app crashes
  if (method === 'eth_subscribe' || method === 'eth_unsubscribe') {
    return true
  }

  try {
    const res = await handleProviderRequests(
      {
        method,
        params,
        session,
        origin
      },
      mainCtrl
    )
    return { id, result: res }
  } catch (error: any) {
    let errorRes
    try {
      errorRes = error.serialize()
    } catch (e) {
      errorRes = error
    }
    return { id, error: errorRes }
  }
})

try {
  browser.tabs.onRemoved.addListener(async (tabId: number) => {
    // wait for mainCtrl to be initialized before handling dapp requests
    while (!mainCtrl) {
      // eslint-disable-next-line no-await-in-loop
      await wait(200)
    }
    const sessionKeys = Array.from(mainCtrl.dapps.dappsSessionMap.keys())
    // eslint-disable-next-line no-restricted-syntax
    for (const key of sessionKeys.filter((k) => k.startsWith(`${tabId}-`))) {
      mainCtrl.dapps.deleteDappSession(key)
    }
  })
} catch (error) {
  console.error('Failed to register browser.tabs.onRemoved.addListener', error)
}

// Open the get-started screen in a new tab right after the extension is installed.
browser.runtime.onInstalled.addListener(({ reason }: any) => {
  // It makes Puppeteer tests a bit slow (waiting the get-started tab to be loaded, switching back to the tab under the tests),
  // and we prefer to skip opening it for the testing.
  if (process.env.IS_TESTING === 'true') return
  browser.runtime.setUninstallURL('https://www.ambire.com/uninstall')
  if (reason === 'install') {
    setTimeout(() => {
      const extensionURL = browser.runtime.getURL('tab.html')
      browser.tabs.create({ url: extensionURL })
    }, 500)
  }
})

// FIXME: Without attaching an event listener (synchronous) here, the other `navigator.hid`
// listeners that attach when the user interacts with Ledger, are not getting triggered for manifest v3.
if ('hid' in navigator) navigator.hid.addEventListener('disconnect', () => {})
