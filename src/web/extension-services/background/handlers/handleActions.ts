/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/return-await */
import {
  BIP44_STANDARD_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import { MainController } from '@ambire-common/controllers/main/main'
import { ExternalKey, Key, ReadyToAddKeys } from '@ambire-common/interfaces/keystore'
import { isDerivedForSmartAccountKeyOnly } from '@ambire-common/libs/account/account'
import { KeyIterator } from '@ambire-common/libs/keyIterator/keyIterator'
import { getDefaultKeyLabel, getExistingKeyLabel } from '@ambire-common/libs/keys/keys'
import { Action } from '@web/extension-services/background/actions'
import AutoLockController from '@web/extension-services/background/controllers/auto-lock'
import { ExtensionUpdateController } from '@web/extension-services/background/controllers/extension-update'
import { WalletStateController } from '@web/extension-services/background/controllers/wallet-state'
import { controllersNestedInMainMapping } from '@web/extension-services/background/types'
import { Port, PortMessenger } from '@web/extension-services/messengers'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'
import LatticeKeyIterator from '@web/modules/hardware-wallet/libs/latticeKeyIterator'
import LedgerKeyIterator from '@web/modules/hardware-wallet/libs/ledgerKeyIterator'
import TrezorKeyIterator from '@web/modules/hardware-wallet/libs/trezorKeyIterator'

export const handleActions = async (
  action: Action,
  {
    pm,
    port,
    mainCtrl,
    ledgerCtrl,
    trezorCtrl,
    latticeCtrl,
    walletStateCtrl,
    autoLockCtrl,
    extensionUpdateCtrl
  }: {
    pm: PortMessenger
    port: Port
    mainCtrl: MainController
    ledgerCtrl: LedgerController
    trezorCtrl: TrezorController
    latticeCtrl: LatticeController
    walletStateCtrl: WalletStateController
    autoLockCtrl: AutoLockController
    extensionUpdateCtrl: ExtensionUpdateController
  }
) => {
  // @ts-ignore
  const { type, params } = action
  switch (type) {
    case 'UPDATE_PORT_URL': {
      if (port.sender) {
        port.sender.url = params.url
        if (port.sender.tab) port.sender.tab.url = params.url
      }
      break
    }
    case 'INIT_CONTROLLER_STATE': {
      if (params.controller === ('main' as any)) {
        const mainCtrlState: any = { ...mainCtrl.toJSON() }
        // We are removing the state of the nested controllers in main to avoid the CPU-intensive task of parsing + stringifying.
        // We should access the state of the nested controllers directly from their context instead of accessing them through the main ctrl state on the FE.
        // Keep in mind: if we just spread `ctrl` instead of calling `ctrl.toJSON()`, the getters won't be included.
        Object.keys(controllersNestedInMainMapping).forEach((nestedCtrlName) => {
          delete mainCtrlState[nestedCtrlName]
        })
        pm.send('> ui', { method: 'main', params: mainCtrlState })
      } else if (params.controller === ('walletState' as any)) {
        pm.send('> ui', { method: 'walletState', params: walletStateCtrl })
      } else if (params.controller === ('autoLock' as any)) {
        pm.send('> ui', { method: 'autoLock', params: autoLockCtrl })
      } else if (params.controller === ('extensionUpdate' as any)) {
        pm.send('> ui', { method: 'extensionUpdate', params: extensionUpdateCtrl })
      } else {
        pm.send('> ui', {
          method: params.controller,
          params: (mainCtrl as any)[params.controller]
        })
      }
      break
    }
    case 'MAIN_CONTROLLER_ON_POPUP_OPEN':
      return mainCtrl.onPopupOpen()
    case 'MAIN_CONTROLLER_LOCK':
      return mainCtrl.lock()
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
      const keyIterator = new KeyIterator(params.privKeyOrSeed, params.seedPassphrase)

      // if it enters here, it's from the default seed. We can init the account adder like so
      if (keyIterator.subType === 'seed' && params.shouldPersist) {
        await mainCtrl.keystore.addSeed({ seed: params.privKeyOrSeed, hdPathTemplate })
      }
      if (keyIterator.subType === 'seed' && params.shouldAddToTemp) {
        await mainCtrl.keystore.addSeedToTemp({
          seed: params.privKeyOrSeed,
          seedPassphrase: params.seedPassphrase,
          hdPathTemplate
        })
      }

      await mainCtrl.accountAdder.init({
        keyIterator,
        pageSize: keyIterator.subType === 'private-key' ? 1 : 5,
        hdPathTemplate
      })

      return await mainCtrl.accountAdder.setPage({ page: 1 })
    }
    case 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_FROM_SAVED_SEED_PHRASE': {
      if (mainCtrl.accountAdder.isInitialized) mainCtrl.accountAdder.reset()
      const keystoreSavedSeed = await mainCtrl.keystore.getSavedSeed()
      console.log('keystoreSavedSeed', keystoreSavedSeed)
      if (!keystoreSavedSeed) return
      const keyIterator = new KeyIterator(keystoreSavedSeed.seed, keystoreSavedSeed.seedPassphrase)
      await mainCtrl.accountAdder.init({
        keyIterator,
        pageSize: 5,
        hdPathTemplate: keystoreSavedSeed.hdPathTemplate
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
      return await mainCtrl.selectAccount(params.accountAddr)
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
        readyToAddKeys.internal = mainCtrl.accountAdder.retrieveInternalKeysOfSelectedAccounts()
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
              label: `${HARDWARE_WALLET_DEVICE_NAMES[mainCtrl.accountAdder.type as Key['type']]} ${
                getExistingKeyLabel(
                  mainCtrl.keystore.keys,
                  addr,
                  mainCtrl.accountAdder.type as Key['type']
                ) ||
                getDefaultKeyLabel(
                  mainCtrl.keystore.keys.filter((key) => account.associatedKeys.includes(key.addr)),
                  i
                )
              }`,
              dedicatedToOneSA: isDerivedForSmartAccountKeyOnly(index),
              meta: {
                deviceId: deviceIds[keyType],
                deviceModel: deviceModels[keyType],
                // always defined in the case of external keys
                hdPathTemplate: mainCtrl.accountAdder.hdPathTemplate as HD_PATH_TEMPLATE_TYPE,
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
    case 'IMPORT_SMART_ACCOUNT_JSON': {
      // Add accounts first, because some of the next steps have validation
      // if accounts exists.
      await mainCtrl.accounts.addAccounts([params.readyToAddAccount])

      // Then add keys, because some of the next steps could have validation
      // if keys exists. Should be separate (not combined in Promise.all,
      // since firing multiple keystore actions is not possible
      // (the #wrapKeystoreAction listens for the first one to finish and
      // skips the parallel one, if one is requested).

      return await mainCtrl.keystore.addKeys(params.keys)
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
      await mainCtrl.importSmartAccountFromSavedSeed(params.seed)
      break
    }
    case 'ADD_NEXT_SMART_ACCOUNT_FROM_DEFAULT_SEED_PHRASE': {
      await mainCtrl.importSmartAccountFromSavedSeed()
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
        params.actionExecutionType
      )

    case 'MAIN_CONTROLLER_BUILD_CLAIM_WALLET_USER_REQUEST':
      return await mainCtrl.buildClaimWalletUserRequest(params.token)
    case 'MAIN_CONTROLLER_BUILD_MINT_VESTING_USER_REQUEST':
      return await mainCtrl.buildMintVestingUserRequest(params.token)
    case 'MAIN_CONTROLLER_ADD_USER_REQUEST':
      return await mainCtrl.addUserRequest(params)
    case 'MAIN_CONTROLLER_REMOVE_USER_REQUEST':
      return mainCtrl.removeUserRequest(params.id)
    case 'MAIN_CONTROLLER_RESOLVE_USER_REQUEST':
      return mainCtrl.resolveUserRequest(params.data, params.id)
    case 'MAIN_CONTROLLER_REJECT_USER_REQUEST':
      return mainCtrl.rejectUserRequest(params.err, params.id)
    case 'MAIN_CONTROLLER_REJECT_SIGN_ACCOUNT_OP_CALL': {
      return mainCtrl.rejectSignAccountOpCall(params.callId)
    }
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
    case 'MAIN_CONTROLLER_ACTIVITY_SET_ACC_OPS_FILTERS':
      return mainCtrl.activity.filterAccountsOps(
        params.sessionId,
        params.filters,
        params.pagination
      )
    case 'MAIN_CONTROLLER_ACTIVITY_SET_SIGNED_MESSAGES_FILTERS':
      return mainCtrl.activity.filterSignedMessages(
        params.sessionId,
        params.filters,
        params.pagination
      )
    case 'MAIN_CONTROLLER_ACTIVITY_RESET_ACC_OPS_FILTERS':
      return mainCtrl.activity.resetAccountsOpsFilters(params.sessionId)
    case 'MAIN_CONTROLLER_ACTIVITY_RESET_SIGNED_MESSAGES_FILTERS':
      return mainCtrl.activity.resetSignedMessagesFilters(params.sessionId)
    case 'ACTIVITY_CONTROLLER_HIDE_BANNER':
      return await mainCtrl.activity.hideBanner(params)

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

    case 'SELECTED_ACCOUNT_SET_DASHBOARD_NETWORK_FILTER': {
      mainCtrl.selectedAccount.setDashboardNetworkFilter(params.dashboardNetworkFilter)
      break
    }

    case 'SWAP_AND_BRIDGE_CONTROLLER_INIT_FORM':
      return await mainCtrl.swapAndBridge.initForm(params.sessionId)
    case 'SWAP_AND_BRIDGE_CONTROLLER_UNLOAD_SCREEN':
      return mainCtrl.swapAndBridge.unloadScreen(params.sessionId)
    case 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM':
      return mainCtrl.swapAndBridge.updateForm(params)
    case 'SWAP_AND_BRIDGE_CONTROLLER_SWITCH_FROM_AND_TO_TOKENS':
      return await mainCtrl.swapAndBridge.switchFromAndToTokens()
    case 'SWAP_AND_BRIDGE_CONTROLLER_ADD_TO_TOKEN_BY_ADDRESS':
      return await mainCtrl.swapAndBridge.addToTokenByAddress(params.address)
    case 'SWAP_AND_BRIDGE_CONTROLLER_SELECT_ROUTE':
      return mainCtrl.swapAndBridge.selectRoute(params.route)
    case 'SWAP_AND_BRIDGE_CONTROLLER_SUBMIT_FORM':
      return await mainCtrl.buildSwapAndBridgeUserRequest()
    case 'SWAP_AND_BRIDGE_CONTROLLER_ACTIVE_ROUTE_BUILD_NEXT_USER_REQUEST':
      return await mainCtrl.buildSwapAndBridgeUserRequest(params.activeRouteId)
    case 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_QUOTE': {
      await mainCtrl.swapAndBridge.updateQuote({
        skipPreviousQuoteRemoval: true,
        skipQuoteUpdateOnSameValues: false,
        skipStatusUpdate: false
      })
      break
    }
    case 'MAIN_CONTROLLER_REMOVE_ACTIVE_ROUTE':
      return mainCtrl.removeActiveRoute(params.activeRouteId)

    case 'ACTIONS_CONTROLLER_REMOVE_FROM_ACTIONS_QUEUE':
      return mainCtrl.actions.removeAction(params.id, params.shouldOpenNextAction)
    case 'ACTIONS_CONTROLLER_FOCUS_ACTION_WINDOW':
      return mainCtrl.actions.focusActionWindow()
    case 'ACTIONS_CONTROLLER_CLOSE_ACTION_WINDOW':
      return mainCtrl.actions.closeActionWindow()
    case 'ACTIONS_CONTROLLER_SET_CURRENT_ACTION_BY_ID':
      return mainCtrl.actions.setCurrentActionById(params.actionId)
    case 'ACTIONS_CONTROLLER_SET_CURRENT_ACTION_BY_INDEX':
      return mainCtrl.actions.setCurrentActionByIndex(params.index)
    case 'ACTIONS_CONTROLLER_SET_WINDOW_LOADED':
      return mainCtrl.actions.setWindowLoaded()

    case 'MAIN_CONTROLLER_RELOAD_SELECTED_ACCOUNT': {
      return await mainCtrl.reloadSelectedAccount({
        networkId: params?.networkId
      })
    }
    case 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT_PORTFOLIO': {
      return await mainCtrl.updateSelectedAccountPortfolio(params?.forceUpdate, params?.network)
    }

    case 'PORTFOLIO_CONTROLLER_GET_TEMPORARY_TOKENS': {
      if (!mainCtrl.selectedAccount.account) return

      return await mainCtrl.portfolio.getTemporaryTokens(
        mainCtrl.selectedAccount.account.addr,
        params.networkId,
        params.additionalHint
      )
    }
    case 'PORTFOLIO_CONTROLLER_ADD_CUSTOM_TOKEN': {
      return await mainCtrl.portfolio.addCustomToken(
        params.token,
        mainCtrl.selectedAccount.account?.addr,
        params.shouldUpdatePortfolio
      )
    }
    case 'PORTFOLIO_CONTROLLER_REMOVE_CUSTOM_TOKEN': {
      return await mainCtrl.portfolio.removeCustomToken(
        params.token,
        mainCtrl.selectedAccount.account?.addr,
        params.shouldUpdatePortfolio
      )
    }
    case 'PORTFOLIO_CONTROLLER_TOGGLE_HIDE_TOKEN': {
      return await mainCtrl.portfolio.toggleHideToken(
        params.token,
        mainCtrl.selectedAccount.account?.addr,
        params.shouldUpdatePortfolio
      )
    }
    case 'PORTFOLIO_CONTROLLER_CHECK_TOKEN': {
      if (!mainCtrl.selectedAccount.account) return
      return await mainCtrl.portfolio.updateTokenValidationByStandard(
        params.token,
        mainCtrl.selectedAccount.account.addr
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
    case 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE':
      return mainCtrl.keystore.resetErrorState()
    case 'KEYSTORE_CONTROLLER_CHANGE_PASSWORD':
      return await mainCtrl.keystore.changeKeystorePassword(params.newSecret, params.secret)
    case 'KEYSTORE_CONTROLLER_CHANGE_PASSWORD_FROM_RECOVERY':
      // In the case we change the user's device password through the recovery process,
      // we don't know the old password, which is why we send only the new password.
      return await mainCtrl.keystore.changeKeystorePassword(params.newSecret)
    case 'KEYSTORE_CONTROLLER_SEND_PRIVATE_KEY_OVER_CHANNEL':
      return await mainCtrl.keystore.sendPrivateKeyToUi(params.keyAddr)
    case 'KEYSTORE_CONTROLLER_SEND_SEED_OVER_CHANNEL':
      return await mainCtrl.keystore.sendSeedToUi()
    case 'KEYSTORE_CONTROLLER_DELETE_SAVED_SEED':
      return await mainCtrl.keystore.deleteSavedSeed()
    case 'KEYSTORE_CONTROLLER_MOVE_SEED_FROM_TEMP': {
      if (params.action === 'save') {
        return await mainCtrl.keystore.moveTempSeedToKeystoreSeeds()
      }
      return mainCtrl.keystore.deleteTempSeed()
    }

    case 'EMAIL_VAULT_CONTROLLER_GET_INFO':
      return await mainCtrl.emailVault.getEmailVaultInfo(params.email)
    case 'EMAIL_VAULT_CONTROLLER_UPLOAD_KEYSTORE_SECRET':
      return await mainCtrl.emailVault.uploadKeyStoreSecret(params.email)
    case 'EMAIL_VAULT_CONTROLLER_HANDLE_MAGIC_LINK_KEY':
      return await mainCtrl.emailVault.handleMagicLinkKey(params.email, undefined, params.flow)
    case 'EMAIL_VAULT_CONTROLLER_CANCEL_CONFIRMATION':
      return mainCtrl.emailVault.cancelEmailConfirmation()
    case 'EMAIL_VAULT_CONTROLLER_RECOVER_KEYSTORE':
      return await mainCtrl.emailVault.recoverKeyStore(params.email, params.newPass)
    case 'EMAIL_VAULT_CONTROLLER_CLEAN_MAGIC_AND_SESSION_KEYS':
      return await mainCtrl.emailVault.cleanMagicAndSessionKeys()
    case 'EMAIL_VAULT_CONTROLLER_REQUEST_KEYS_SYNC':
      return await mainCtrl.emailVault.requestKeysSync(params.email, params.keys)
    case 'EMAIL_VAULT_CONTROLLER_DISMISS_BANNER':
      return mainCtrl.emailVault.dismissBanner()
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
    case 'INVITE_CONTROLLER_BECOME_OG': {
      return await mainCtrl.invite.becomeOG()
    }
    case 'INVITE_CONTROLLER_REVOKE_OG': {
      return await mainCtrl.invite.revokeOG()
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
    case 'EXTENSION_UPDATE_CONTROLLER_APPLY_UPDATE': {
      extensionUpdateCtrl.applyUpdate()
      break
    }

    default:
      return console.error(
        `Dispatched ${type} action, but handler in the extension background process not found!`
      )
  }
}
