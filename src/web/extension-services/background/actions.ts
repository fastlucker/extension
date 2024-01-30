import { HumanizerInfoType } from 'src/ambire-common/v1/hooks/useConstants'

import AccountAdderController, {
  ReadyToAddKeys
} from '@ambire-common/controllers/accountAdder/accountAdder'
import { Filters, Pagination, SignedMessage } from '@ambire-common/controllers/activity/activity'
import { FeeSpeed } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { Account, AccountId, AccountStates } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'
import { NetworkDescriptor, NetworkId } from '@ambire-common/interfaces/networkDescriptor'
import {
  AccountPreferences,
  KeyPreferences,
  NetworkPreference
} from '@ambire-common/interfaces/settings'
import { Message, UserRequest } from '@ambire-common/interfaces/userRequest'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import { EstimateResult } from '@ambire-common/libs/estimate/estimate'
import { GasRecommendation } from '@ambire-common/libs/gasPrice/gasPrice'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { WalletController } from '@mobile/modules/web3/services/webview-background/wallet'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'

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
    keyTypeInternalSubtype?: 'seed' | 'private-key'
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
  params: {
    selectedAccounts: AccountAdderController['selectedAccounts']
    readyToAddAccountPreferences: AccountPreferences
    readyToAddKeys: {
      internal: ReadyToAddKeys['internal']
      externalTypeOnly: Key['type']
    }
    readyToAddKeyPreferences: KeyPreferences
  }
}
type MainControllerAddAccounts = {
  type: 'MAIN_CONTROLLER_ADD_VIEW_ONLY_ACCOUNTS'
  params: { accounts: Account[] }
}
type MainControllerAccountAdderCreateAndAddEmailAccount = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_CREATE_AND_ADD_EMAIL_ACCOUNT'
  params: {
    email: string
    recoveryKey: string
  }
}
type MainControllerAccountAdderAddExistingEmailAccounts = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_EXISTING_EMAIL_ACCOUNTS'
  params: {
    accounts: Account[]
  }
}
type MainControllerAccountAdderReset = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET'
}
type MainControllerSettingsAddAccountPreferences = {
  type: 'MAIN_CONTROLLER_SETTINGS_ADD_ACCOUNT_PREFERENCES'
  params: AccountPreferences
}

type MainControllerUpdateNetworkPreferences = {
  type: 'MAIN_CONTROLLER_UPDATE_NETWORK_PREFERENCES'
  params: {
    networkPreferences: NetworkPreference
    networkId: NetworkDescriptor['id']
  }
}

type MainControllerResetNetworkPreference = {
  type: 'MAIN_CONTROLLER_RESET_NETWORK_PREFERENCE'
  params: {
    preferenceKey: keyof NetworkPreference
    networkId: NetworkDescriptor['id']
  }
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
  params: {
    dapp: {
      name: string
      icon: string
    }
    messageToSign: Message
    accounts: Account[]
    accountStates: AccountStates
  }
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
  params: { signedMessage: SignedMessage }
}
type MainControllerActivityInitAction = {
  type: 'MAIN_CONTROLLER_ACTIVITY_INIT'
  params: { filters: Filters }
}
type MainControllerActivitySetFiltersAction = {
  type: 'MAIN_CONTROLLER_ACTIVITY_SET_FILTERS'
  params: { filters: Filters }
}
type MainControllerActivitySetAccountOpsPaginationAction = {
  type: 'MAIN_CONTROLLER_ACTIVITY_SET_ACCOUNT_OPS_PAGINATION'
  params: { pagination: Pagination }
}
type MainControllerActivitySetSignedMessagesPaginationAction = {
  type: 'MAIN_CONTROLLER_ACTIVITY_SET_SIGNED_MESSAGES_PAGINATION'
  params: { pagination: Pagination }
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
    selectedToken?: TokenResult
    humanizerInfo?: HumanizerInfoType
    tokens?: TokenResult[]
    recipientAddress?: string
    amount?: string
    isSWWarningAgreed?: boolean
    isRecipientAddressUnknownAgreed?: boolean
    isTopUp?: boolean
  }
}

type MainControllerTransferOnRecipientAddressChangeAction = {
  type: 'MAIN_CONTROLLER_TRANSFER_ON_RECIPIENT_ADDRESS_CHANGE'
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
type LatticeControllerUnlockAction = {
  type: 'LATTICE_CONTROLLER_UNLOCK'
}
type MainControllerUpdateSelectedAccount = {
  type: 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT'
  params: {
    forceUpdate?: boolean
  }
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
    feeToken?: TokenResult
    paidBy?: string
    speed?: FeeSpeed
    signingKeyAddr?: string
    signingKeyType?: string
  }
}
type MainControllerSignAccountOpSignAction = {
  type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_SIGN'
}

type KeystoreControllerAddSecretAction = {
  type: 'KEYSTORE_CONTROLLER_ADD_SECRET'
  params: { secretId: string; secret: string; extraEntropy: string; leaveUnlocked: boolean }
}
type KeystoreControllerUnlockWithSecretAction = {
  type: 'KEYSTORE_CONTROLLER_UNLOCK_WITH_SECRET'
  params: { secretId: string; secret: string }
}
type KeystoreControllerLockAction = {
  type: 'KEYSTORE_CONTROLLER_LOCK'
}
type KeystoreControllerResetErrorStateAction = {
  type: 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE'
}
type KeystoreControllerChangePasswordAction = {
  type: 'KEYSTORE_CONTROLLER_CHANGE_PASSWORD'
  params: { secret: string; newSecret: string }
}

type EmailVaultControllerGetInfoAction = {
  type: 'EMAIL_VAULT_CONTROLLER_GET_INFO'
  params: { email: string }
}
type EmailVaultControllerUploadKeystoreSecretAction = {
  type: 'EMAIL_VAULT_CONTROLLER_UPLOAD_KEYSTORE_SECRET'
  params: { email: string }
}
type EmailVaultControllerRecoverKeystoreAction = {
  type: 'EMAIL_VAULT_CONTROLLER_RECOVER_KEYSTORE'
  params: { email: string }
}
type EmailVaultControllerRequestKeysSyncAction = {
  type: 'EMAIL_VAULT_CONTROLLER_REQUEST_KEYS_SYNC'
  params: { email: string; keys: string[] }
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
type ChangeCurrentDappNetworkAction = {
  type: 'CHANGE_CURRENT_DAPP_NETWORK'
  params: { chainId: number; origin: string }
}

type SetIsDefaultWalletAction = {
  type: 'SET_IS_DEFAULT_WALLET'
  params: { isDefaultWallet: boolean }
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
  | MainControllerUpdateNetworkPreferences
  | MainControllerResetNetworkPreference
  | MainControllerAccountAdderSetPageAction
  | MainControllerAccountAdderAddAccounts
  | MainControllerAddAccounts
  | MainControllerAccountAdderCreateAndAddEmailAccount
  | MainControllerAccountAdderAddExistingEmailAccounts
  | MainControllerAddUserRequestAction
  | MainControllerRemoveUserRequestAction
  | MainControllerSignMessageInitAction
  | MainControllerSignMessageResetAction
  | MainControllerSignMessageSignAction
  | MainControllerSignMessageSetSignKeyAction
  | MainControllerBroadcastSignedMessageAction
  | MainControllerActivityInitAction
  | MainControllerActivitySetFiltersAction
  | MainControllerActivitySetAccountOpsPaginationAction
  | MainControllerActivitySetSignedMessagesPaginationAction
  | MainControllerActivityResetAction
  | MainControllerSignAccountOpInitAction
  | MainControllerSignAccountOpDestroyAction
  | MainControllerSignAccountOpEstimateAction
  | MainControllerSignAccountOpUpdateMainDepsAction
  | MainControllerSignAccountOpSignAction
  | MainControllerSignAccountOpUpdateAction
  | MainControllerTransferResetAction
  | MainControllerTransferBuildUserRequestAction
  | MainControllerTransferUpdateAction
  | MainControllerTransferOnRecipientAddressChangeAction
  | NotificationControllerResolveRequestAction
  | NotificationControllerRejectRequestAction
  | LedgerControllerUnlockAction
  | LatticeControllerUnlockAction
  | MainControllerUpdateSelectedAccount
  | KeystoreControllerAddSecretAction
  | KeystoreControllerUnlockWithSecretAction
  | KeystoreControllerLockAction
  | KeystoreControllerResetErrorStateAction
  | KeystoreControllerChangePasswordAction
  | EmailVaultControllerGetInfoAction
  | EmailVaultControllerUploadKeystoreSecretAction
  | EmailVaultControllerRecoverKeystoreAction
  | EmailVaultControllerRequestKeysSyncAction
  | WalletControllerGetConnectedSiteAction
  | WalletControllerRequestVaultControllerMethodAction
  | WalletControllerSetStorageAction
  | WalletControllerGetCurrentSiteAction
  | WalletControllerRemoveConnectedSiteAction
  | WalletControllerGetConnectedSitesAction
  | NotificationControllerReopenCurrentNotificationRequestAction
  | NotificationControllerOpenNotificationRequestAction
  | ChangeCurrentDappNetworkAction
  | SetIsDefaultWalletAction

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
  LATTICE_CONTROLLER_UNLOCK: ReturnType<LatticeController['unlock']>
}
