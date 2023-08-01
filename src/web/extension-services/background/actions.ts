import { Account } from 'ambire-common/src/interfaces/account'

type MainControllerAccountAdderInitLedgerAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER'
  params: {
    preselectedAccounts: Account[]
    page?: number | undefined
    pageSize?: number | undefined
    derivationPath?: string | undefined
  }
}
type MainControllerAccountAdderInitTrezorAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR'
  params: {
    preselectedAccounts: Account[]
    page?: number | undefined
    pageSize?: number | undefined
    derivationPath?: string | undefined
  }
}
type MainControllerAccountAdderInitLatticeAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE'
  params: {
    preselectedAccounts: Account[]
    page?: number | undefined
    pageSize?: number | undefined
    derivationPath?: string | undefined
  }
}
type MainControllerAccountAdderStateAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_STATE'
}
type MainControllerAccountAdderSetPageAction = {
  type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE'
  params: {
    page: number
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

export type Action =
  | MainControllerAccountAdderInitLatticeAction
  | MainControllerAccountAdderInitTrezorAction
  | MainControllerAccountAdderInitLedgerAction
  | MainControllerAccountAdderStateAction
  | MainControllerAccountAdderSetPageAction
  | LedgerControllerUnlockAction
  | LedgerControllerGetPathForIndexAction
  | LedgerControllerAppAction
