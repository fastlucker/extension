/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/return-await */
import {
  BIP44_STANDARD_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import { MainController } from '@ambire-common/controllers/main/main'
import { ExternalKey, Key, ReadyToAddKeys } from '@ambire-common/interfaces/keystore'
import { Network } from '@ambire-common/interfaces/network'
import { isDerivedForSmartAccountKeyOnly } from '@ambire-common/libs/account/account'
import { KeyIterator } from '@ambire-common/libs/keyIterator/keyIterator'
import { getDefaultKeyLabel, getExistingKeyLabel } from '@ambire-common/libs/keys/keys'
import { Action } from '@web/extension-services/background/actions'
import AutoLockController from '@web/extension-services/background/controllers/auto-lock'
import { WalletStateController } from '@web/extension-services/background/controllers/wallet-state'
import { controllersNestedInMainMapping } from '@web/extension-services/background/types'
import { PortMessenger } from '@web/extension-services/messengers'
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
    mainCtrl,
    ledgerCtrl,
    trezorCtrl,
    latticeCtrl,
    walletStateCtrl,
    autoLockCtrl
  }: {
    pm: PortMessenger
    mainCtrl: MainController
    ledgerCtrl: LedgerController
    trezorCtrl: TrezorController
    latticeCtrl: LatticeController
    walletStateCtrl: WalletStateController
    autoLockCtrl: AutoLockController
  }
) => {
  // @ts-ignore
  const { type, params } = action
  switch (type) {
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

      // if it enters here, it's from the default seed. We can init the account adder like so
      if (keyIterator.subType === 'seed' && params.shouldPersist) {
        await mainCtrl.keystore.addSeed({ seed: params.privKeyOrSeed, hdPathTemplate })
      }
      if (keyIterator.subType === 'seed' && params.shouldAddToTemp) {
        await mainCtrl.keystore.addSeedToTemp({ seed: params.privKeyOrSeed, hdPathTemplate })
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

      if (!keystoreSavedSeed) return
      const keyIterator = new KeyIterator(keystoreSavedSeed.seed)
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
        params.executionType
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
      if (!mainCtrl.selectedAccount.account) return

      return await mainCtrl.portfolio.getTemporaryTokens(
        mainCtrl.selectedAccount.account.addr,
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
        mainCtrl.selectedAccount.account?.addr || '',
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
        mainCtrl.selectedAccount.account?.addr || '',
        tokenNetwork,
        undefined,
        {
          forceUpdate: true
        }
      )
    }
    case 'PORTFOLIO_CONTROLLER_CHECK_TOKEN': {
      if (!mainCtrl.selectedAccount.account) return
      return await mainCtrl.portfolio.updateTokenValidationByStandard(
        params.token,
        mainCtrl.selectedAccount.account.addr
      )
    }
    case 'PORTFOLIO_CONTROLLER_UPDATE_CONFETTI_TO_SHOWN': {
      return await mainCtrl.portfolio.setShouldShowConfettiToFalse(params.accountAddr)
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
