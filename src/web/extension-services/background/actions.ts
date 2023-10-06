import { Filters } from 'ambire-common/src/controllers/activity/activity'
import { Account, AccountStates } from 'ambire-common/src/interfaces/account'
import { Key } from 'ambire-common/src/interfaces/keystore'
import { Message, UserRequest } from 'ambire-common/src/interfaces/userRequest'

import { WalletController } from '@mobile/modules/web3/services/webview-background/wallet'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'

import { controllersMapping } from './types'

type InitControllerStateAction = {
  type: 'INIT_CONTROLLER_STATE'
  params: {
    controller: keyof typeof controllersMapping
  }
}

type MainControllerAccountAdderInitLedgerAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER'
}
type MainControllerAccountAdderInitTrezorAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR'
}
type MainControllerAccountAdderInitLatticeAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE'
  params: {
    page?: number | undefined
    pageSize?: number | undefined
    derivationPath?: string | undefined
  }
}
type MainControllerAccountAdderInitPrivateKeyOrSeedPhraseAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE'
  params: {
    privKeyOrSeed: string
  }
}
type MainControllerAccountAdderInitViewOnlyAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_VIEW_ONLY'
}
type MainControllerSelectAccountAction = {
  type: 'MAIN_CONTROLLER_SELECT_ACCOUNT'
  params: {
    accountAddr: Account['addr']
  }
}
type MainControllerAccountAdderSelectAccountAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SELECT_ACCOUNT'
  params: {
    account: Account
  }
}
type MainControllerAccountAdderDeselectAccountAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_DESELECT_ACCOUNT'
  params: {
    account: Account
  }
}

type MainControllerAccountAdderSetPageAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE'
  params: {
    page: number
  }
}
type MainControllerAccountAdderAddAccounts = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS'
  params: {
    accounts: Account[]
  }
}
type MainControllerAccountAdderReset = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET'
}

type MainControllerAddUserRequestAction = {
  type: 'MAIN_CONTROLLER_ADD_USER_REQUEST'
  params: UserRequest
}
type MainControllerRemoveUserRequestAction = {
  type: 'MAIN_CONTROLLER_REMOVE_USER_REQUEST'
  params: { id: UserRequest['id'] }
}
type MainControllerSignMessageInitAction = {
  type: 'MAIN_CONTROLLER_SIGN_MESSAGE_INIT'
  params: { messageToSign: Message; accounts: Account[]; accountStates: AccountStates }
}
type MainControllerSignMessageResetAction = {
  type: 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET'
}
type MainControllerSignMessageSignAction = {
  type: 'MAIN_CONTROLLER_SIGN_MESSAGE_SIGN'
}
type MainControllerSignMessageSetSignKeyAction = {
  type: 'MAIN_CONTROLLER_SIGN_MESSAGE_SET_SIGN_KEY'
  params: { key: Key['addr']; type: Key['type'] }
}
type MainControllerBroadcastSignedMessageAction = {
  type: 'MAIN_CONTROLLER_BROADCAST_SIGNED_MESSAGE'
  params: { signedMessage: Message }
}
type MainControllerActivityInitAction = {
  type: 'MAIN_CONTROLLER_ACTIVITY_INIT'
  params: { filters: Filters }
}
type MainControllerActivityResetAction = {
  type: 'MAIN_CONTROLLER_ACTIVITY_RESET'
}

type NotificationControllerResolveRequestAction = {
  type: 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST'
  params: { data: any; id?: number }
}
type NotificationControllerRejectRequestAction = {
  type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST'
  params: { err: string; id?: number }
}
type LedgerControllerUnlockAction = {
  type: 'LEDGER_CONTROLLER_UNLOCK'
}
type LedgerControllerGetPathForIndexAction = {
  type: 'LEDGER_CONTROLLER_GET_PATH_FOR_INDEX'
  params: any // TODO
}
type LedgerControllerAppAction = {
  type: 'LEDGER_CONTROLLER_APP'
}
type LedgerControllerAuthorizeHIDPermissionAction = {
  type: 'LEDGER_CONTROLLER_AUTHORIZE_HID_PERMISSION'
}
type TrezorControllerUnlockAction = {
  type: 'TREZOR_CONTROLLER_UNLOCK'
}
type LatticeControllerUnlockAction = {
  type: 'LATTICE_CONTROLLER_UNLOCK'
}
type MainControllerUpdateSelectedAccount = {
  type: 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT'
}

type KeystoreControllerAddSecretAction = {
  type: 'KEYSTORE_CONTROLLER_ADD_SECRET'
  params: { secretId: string; secret: string; extraEntropy: string; leaveUnlocked: boolean }
}
type KeystoreControllerAddKeysExternallyStored = {
  type: 'KEYSTORE_CONTROLLER_ADD_KEYS_EXTERNALLY_STORED'
  params: { keyType: Exclude<Key['type'], 'internal'> }
}
type KeystoreControllerUnlockWithSecretAction = {
  type: 'KEYSTORE_CONTROLLER_UNLOCK_WITH_SECRET'
  params: { secretId: string; secret: string }
}
type KeystoreControllerAddKeysAction = {
  type: 'KEYSTORE_CONTROLLER_ADD_KEYS'
  params: { keys: { privateKey: string; label: string }[] }
}
type KeystoreControllerLockAction = {
  type: 'KEYSTORE_CONTROLLER_LOCK'
}
type KeystoreControllerResetErrorStateAction = {
  type: 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE'
}

type WalletControllerGetConnectedSiteAction = {
  type: 'WALLET_CONTROLLER_GET_CONNECTED_SITE'
  params: { origin: string }
}
type WalletControllerGetConnectedSitesAction = {
  type: 'WALLET_CONTROLLER_GET_CONNECTED_SITES'
}
type WalletControllerRequestVaultControllerMethodAction = {
  type: 'WALLET_CONTROLLER_REQUEST_VAULT_CONTROLLER_METHOD'
  params: { method: string; props: any }
}
type WalletControllerSetStorageAction = {
  type: 'WALLET_CONTROLLER_SET_STORAGE'
  params: { key: string; value: any }
}
type WalletControllerGetCurrentSiteAction = {
  type: 'WALLET_CONTROLLER_GET_CURRENT_SITE'
  params: { tabId: number; domain: string }
}
type WalletControllerRemoveConnectedSiteAction = {
  type: 'WALLET_CONTROLLER_REMOVE_CONNECTED_SITE'
  params: { origin: string }
}
type NotificationControllerReopenCurrentNotificationRequestAction = {
  type: 'NOTIFICATION_CONTROLLER_REOPEN_CURRENT_NOTIFICATION_REQUEST'
}
type NotificationControllerOpenNotificationRequestAction = {
  type: 'NOTIFICATION_CONTROLLER_OPEN_NOTIFICATION_REQUEST'
  params: { id: number }
}

export type Action =
  | InitControllerStateAction
  | MainControllerAccountAdderInitLatticeAction
  | MainControllerAccountAdderInitTrezorAction
  | MainControllerAccountAdderInitLedgerAction
  | MainControllerAccountAdderInitPrivateKeyOrSeedPhraseAction
  | MainControllerAccountAdderInitViewOnlyAction
  | MainControllerSelectAccountAction
  | MainControllerAccountAdderSelectAccountAction
  | MainControllerAccountAdderDeselectAccountAction
  | MainControllerAccountAdderReset
  | MainControllerAccountAdderSetPageAction
  | MainControllerAccountAdderAddAccounts
  | MainControllerAddUserRequestAction
  | MainControllerRemoveUserRequestAction
  | MainControllerSignMessageInitAction
  | MainControllerSignMessageResetAction
  | MainControllerSignMessageSignAction
  | MainControllerSignMessageSetSignKeyAction
  | MainControllerBroadcastSignedMessageAction
  | MainControllerActivityInitAction
  | MainControllerActivityResetAction
  | NotificationControllerResolveRequestAction
  | NotificationControllerRejectRequestAction
  | LedgerControllerUnlockAction
  | LedgerControllerGetPathForIndexAction
  | LedgerControllerAppAction
  | LedgerControllerAuthorizeHIDPermissionAction
  | TrezorControllerUnlockAction
  | LatticeControllerUnlockAction
  | MainControllerUpdateSelectedAccount
  | KeystoreControllerAddSecretAction
  | KeystoreControllerAddKeysExternallyStored
  | KeystoreControllerUnlockWithSecretAction
  | KeystoreControllerLockAction
  | KeystoreControllerAddKeysAction
  | KeystoreControllerResetErrorStateAction
  | WalletControllerGetConnectedSiteAction
  | WalletControllerRequestVaultControllerMethodAction
  | WalletControllerSetStorageAction
  | WalletControllerGetCurrentSiteAction
  | WalletControllerRemoveConnectedSiteAction
  | WalletControllerGetConnectedSitesAction
  | NotificationControllerReopenCurrentNotificationRequestAction
  | NotificationControllerOpenNotificationRequestAction

/**
 * These actions types are the one called by `dispatchAsync`. They are meant
 * to return results, in contrast to `dispatch` which does not return.
 */
export type AsyncActionTypes = {
  // TODO: These all should be migrated to use onUpdate emitted events
  // instead of relying on the return value of the action.
  WALLET_CONTROLLER_GET_CURRENT_SITE: ReturnType<WalletController['getCurrentSite']>
  WALLET_CONTROLLER_GET_CONNECTED_SITES: ReturnType<WalletController['getConnectedSites']>
  LEDGER_CONTROLLER_UNLOCK: ReturnType<LedgerController['unlock']>
  TREZOR_CONTROLLER_UNLOCK: ReturnType<TrezorController['unlock']>
  LATTICE_CONTROLLER_UNLOCK: ReturnType<LatticeController['unlock']>
  LEDGER_CONTROLLER_AUTHORIZE_HID_PERMISSION: ReturnType<LedgerController['authorizeHIDPermission']>
}
