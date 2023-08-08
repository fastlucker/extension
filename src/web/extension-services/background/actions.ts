import { Account } from 'ambire-common/src/interfaces/account'

import { NetworkType } from '@common/constants/networks'
import { WalletController } from '@mobile/modules/web3/services/webview-background/wallet'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'
import LedgerController from '@web/modules/hardware-wallet/controllers/LedgerController'
import TrezorController from '@web/modules/hardware-wallet/controllers/TrezorController'

import { ControllerName } from './types'

type InitControllerStateAction = {
  type: 'INIT_CONTROLLER_STATE'
  params: {
    controller: ControllerName
  }
}

type MainControllerAccountAdderInitLedgerAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER'
  params: {
    page?: number | undefined
    pageSize?: number | undefined
    derivationPath?: string | undefined
  }
}
type MainControllerAccountAdderInitTrezorAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR'
  params: {
    page?: number | undefined
    pageSize?: number | undefined
    derivationPath?: string | undefined
  }
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
    page?: number | undefined
    pageSize?: number | undefined
    derivationPath?: string | undefined
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
type MainControllerAccountAdderResetSelectedAccountsAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET_SELECTED_ACCOUNTS'
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

type LedgerControllerUnlockAction = {
  type: 'LEDGER_CONTROLLER_UNLOCK'
  params?: {
    hdPath?: string
  }
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
type WalletControllerIsUnlockedAction = {
  type: 'WALLET_CONTROLLER_IS_UNLOCKED'
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
type WalletControllerActiveFirstApprovalAction = {
  type: 'WALLET_CONTROLLER_ACTIVE_FIRST_APPROVAL'
}
type WalletControllerGetApprovalAction = {
  type: 'WALLET_CONTROLLER_GET_APPROVAL'
}
type WalletControllerResolveApprovalAction = {
  type: 'WALLET_CONTROLLER_RESOLVE_APPROVAL'
  params: any
}
type WalletControllerRejectApprovalAction = {
  type: 'WALLET_CONTROLLER_REJECT_APPROVAL'
  params: { err?: string; stay?: boolean; isInternal?: boolean }
}
type WalletControllerNetworkChangeAction = {
  type: 'WALLET_CONTROLLER_NETWORK_CHANGE'
  params: { network: NetworkType }
}
type WalletControllerAccountChangeAction = {
  type: 'WALLET_CONTROLLER_ACCOUNT_CHANGE'
  params: { selectedAcc: Account['addr'] }
}
type WalletControllerSendRequestAction = {
  type: 'WALLET_CONTROLLER_SEND_REQUEST'
  params: { data: any }
}

export type Action =
  | InitControllerStateAction
  | MainControllerAccountAdderInitLatticeAction
  | MainControllerAccountAdderInitTrezorAction
  | MainControllerAccountAdderInitLedgerAction
  | MainControllerAccountAdderInitPrivateKeyOrSeedPhraseAction
  | MainControllerAccountAdderSelectAccountAction
  | MainControllerAccountAdderDeselectAccountAction
  | MainControllerAccountAdderResetSelectedAccountsAction
  | MainControllerAccountAdderSetPageAction
  | MainControllerAccountAdderAddAccounts
  | LedgerControllerUnlockAction
  | LedgerControllerGetPathForIndexAction
  | LedgerControllerAppAction
  | LedgerControllerAuthorizeHIDPermissionAction
  | TrezorControllerUnlockAction
  | LatticeControllerUnlockAction
  | WalletControllerIsUnlockedAction
  | WalletControllerGetConnectedSiteAction
  | WalletControllerRequestVaultControllerMethodAction
  | WalletControllerSetStorageAction
  | WalletControllerGetCurrentSiteAction
  | WalletControllerRemoveConnectedSiteAction
  | WalletControllerGetConnectedSitesAction
  | WalletControllerActiveFirstApprovalAction
  | WalletControllerGetApprovalAction
  | WalletControllerResolveApprovalAction
  | WalletControllerRejectApprovalAction
  | WalletControllerNetworkChangeAction
  | WalletControllerAccountChangeAction
  | WalletControllerSendRequestAction

/**
 * These actions types are the one called by `dispatchAsync`. They are meant
 * to return results, in contrast to `dispatch` which does not return.
 */
export type AsyncActionTypes = {
  // TODO: These all should be migrated to use onUpdate emitted events
  // instead of relying on the return value of the action.
  WALLET_CONTROLLER_GET_APPROVAL: ReturnType<WalletController['getApproval']>
  WALLET_CONTROLLER_GET_CURRENT_SITE: ReturnType<WalletController['getCurrentSite']>
  WALLET_CONTROLLER_GET_CONNECTED_SITES: ReturnType<WalletController['getConnectedSites']>
  LEDGER_CONTROLLER_UNLOCK: ReturnType<LedgerController['unlock']>
  TREZOR_CONTROLLER_UNLOCK: ReturnType<TrezorController['unlock']>
  LATTICE_CONTROLLER_UNLOCK: ReturnType<LatticeController['unlock']>
  LEDGER_CONTROLLER_AUTHORIZE_HID_PERMISSION: ReturnType<LedgerController['authorizeHIDPermission']>
}
