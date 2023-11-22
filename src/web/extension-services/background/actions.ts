import { HumanizerInfoType } from 'src/ambire-common/v1/hooks/useConstants'

import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import { Filters } from '@ambire-common/controllers/activity/activity'
import { Account, AccountId, AccountStates } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'
import { NetworkDescriptor, NetworkId } from '@ambire-common/interfaces/networkDescriptor'
import { AccountPreferences } from '@ambire-common/interfaces/settings'
import { Message, UserRequest } from '@ambire-common/interfaces/userRequest'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import { EstimateResult } from '@ambire-common/libs/estimate/estimate'
import { GasRecommendation } from '@ambire-common/libs/gasPrice/gasPrice'
import { TokenResult } from '@ambire-common/libs/portfolio'
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
}
type MainControllerAccountAdderInitPrivateKeyOrSeedPhraseAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE'
  params: {
    privKeyOrSeed: string
  }
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
  params: { selectedAccounts: AccountAdderController['selectedAccounts'] }
}
type MainControllerAddAccounts = {
  type: 'MAIN_CONTROLLER_ADD_ACCOUNTS'
  params: { accounts: Account[] }
}
type MainControllerAccountAdderReset = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET'
}
type MainControllerSettingsAddAccountPreferences = {
  type: 'MAIN_CONTROLLER_SETTINGS_ADD_ACCOUNT_PREFERENCES'
  params: AccountPreferences
}

type MainControllerAddUserRequestAction = {
  type: 'MAIN_CONTROLLER_ADD_USER_REQUEST'
  params: UserRequest
}
type MainControllerRemoveUserRequestAction = {
  type: 'MAIN_CONTROLLER_REMOVE_USER_REQUEST'
  params: { id: UserRequest['id'] }
}
type MainControllerRefetchPortfolio = {
  type: 'MAIN_CONTROLLER_REFETCH_PORTFOLIO'
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

type MainControllerTransferResetAction = {
  type: 'MAIN_CONTROLLER_TRANSFER_RESET_FORM'
}

type MainControllerTransferBuildUserRequestAction = {
  type: 'MAIN_CONTROLLER_TRANSFER_BUILD_USER_REQUEST'
}

type MainControllerTransferUpdateAction = {
  type: 'MAIN_CONTROLLER_TRANSFER_UPDATE'
  params: {
    selectedAccount?: string
    preSelectedToken?: string
    humanizerInfo?: HumanizerInfoType
    tokens?: TokenResult[]
    recipientAddress?: string
    amount?: string
    setMaxAmount?: boolean
    isSWWarningAgreed?: boolean
    isRecipientAddressUnknownAgreed?: boolean
  }
}

type MainControllerTransferOnRecipientAddressChangeAction = {
  type: 'MAIN_CONTROLLER_TRANSFER_ON_RECIPIENT_ADDRESS_CHANGE'
}

type MainControllerTransferHandleTokenChangeAction = {
  type: 'MAIN_CONTROLLER_TRANSFER_HANDLE_TOKEN_CHANGE'
  params: {
    tokenAddressAndNetwork: string
  }
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
type MainControllerSignAccountOpInitAction = {
  params: {
    accountAddr: AccountId
    networkId: NetworkId
  }
  type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_INIT'
}
type MainControllerSignAccountOpDestroyAction = {
  type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_DESTROY'
}
type MainControllerSignAccountOpEstimateAction = {
  params: {
    accountAddr: AccountId
    networkId: NetworkId
  }
  type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_ESTIMATE'
}
type MainControllerSignAccountOpUpdateMainDepsAction = {
  type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE_MAIN_DEPS'
  params: {
    accounts?: Account[]
    networks?: NetworkDescriptor[]
    accountStates?: AccountStates
  }
}
type MainControllerSignAccountOpUpdateAction = {
  type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE'
  params: {
    accountOp?: AccountOp
    gasPrices?: GasRecommendation[]
    estimation?: EstimateResult
    feeTokenAddr?: string
    paidBy?: string
    speed?: string
    signingKeyAddr?: string
    signingKeyType?: string
  }
}
type MainControllerSignAccountOpSignAction = {
  type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_SIGN'
}
type MainControllerSignAccountOpResetAction = {
  type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_RESET'
}
type MainControllerBroadcastSignedAccountOpAction = {
  type: 'MAIN_CONTROLLER_BROADCAST_SIGNED_ACCOUNT_OP'
  params: { accountOp: AccountOp }
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
  | MainControllerSelectAccountAction
  | MainControllerAccountAdderSelectAccountAction
  | MainControllerAccountAdderDeselectAccountAction
  | MainControllerAccountAdderReset
  | MainControllerSettingsAddAccountPreferences
  | MainControllerAccountAdderSetPageAction
  | MainControllerAccountAdderAddAccounts
  | MainControllerAddAccounts
  | MainControllerAddUserRequestAction
  | MainControllerRemoveUserRequestAction
  | MainControllerRefetchPortfolio
  | MainControllerSignMessageInitAction
  | MainControllerSignMessageResetAction
  | MainControllerSignMessageSignAction
  | MainControllerSignMessageSetSignKeyAction
  | MainControllerBroadcastSignedMessageAction
  | MainControllerActivityInitAction
  | MainControllerActivityResetAction
  | MainControllerSignAccountOpInitAction
  | MainControllerSignAccountOpDestroyAction
  | MainControllerSignAccountOpEstimateAction
  | MainControllerSignAccountOpUpdateMainDepsAction
  | MainControllerSignAccountOpSignAction
  | MainControllerSignAccountOpUpdateAction
  | MainControllerSignAccountOpResetAction
  | MainControllerBroadcastSignedAccountOpAction
  | MainControllerTransferResetAction
  | MainControllerTransferBuildUserRequestAction
  | MainControllerTransferUpdateAction
  | MainControllerTransferOnRecipientAddressChangeAction
  | MainControllerTransferHandleTokenChangeAction
  | NotificationControllerResolveRequestAction
  | NotificationControllerRejectRequestAction
  | LedgerControllerUnlockAction
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
