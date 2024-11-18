import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import { AccountsController } from '@ambire-common/controllers/accounts/accounts'
import { ActionsController } from '@ambire-common/controllers/actions/actions'
import { ActivityController } from '@ambire-common/controllers/activity/activity'
import { AddressBookController } from '@ambire-common/controllers/addressBook/addressBook'
import { DappsController } from '@ambire-common/controllers/dapps/dapps'
import { DomainsController } from '@ambire-common/controllers/domains/domains'
import { EmailVaultController } from '@ambire-common/controllers/emailVault/emailVault'
import { InviteController } from '@ambire-common/controllers/invite/invite'
import { KeystoreController } from '@ambire-common/controllers/keystore/keystore'
import { MainController } from '@ambire-common/controllers/main/main'
import { NetworksController } from '@ambire-common/controllers/networks/networks'
import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import { ProvidersController } from '@ambire-common/controllers/providers/providers'
import { SelectedAccountController } from '@ambire-common/controllers/selectedAccount/selectedAccount'
import { SignAccountOpController } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import { SwapAndBridgeController } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import { TransferController } from '@ambire-common/controllers/transfer/transfer'
import AutoLockController from '@web/extension-services/background/controllers/auto-lock'
import { WalletStateController } from '@web/extension-services/background/controllers/wallet-state'

export const controllersNestedInMainMapping = {
  providers: ProvidersController,
  networks: NetworksController,
  accounts: AccountsController,
  selectedAccount: SelectedAccountController,
  accountAdder: AccountAdderController,
  keystore: KeystoreController,
  signMessage: SignMessageController,
  portfolio: PortfolioController,
  activity: ActivityController,
  emailVault: EmailVaultController,
  signAccountOp: SignAccountOpController,
  transfer: TransferController,
  dapps: DappsController,
  actions: ActionsController,
  addressBook: AddressBookController,
  domains: DomainsController,
  invite: InviteController,
  swapAndBridge: SwapAndBridgeController

  // Add the rest of the controllers that are part of the main controller:
  // - key is the name of the controller
  // - value is the type of the controller
}
export const controllersMapping = {
  main: MainController,
  walletState: WalletStateController,
  autoLock: AutoLockController,
  ...controllersNestedInMainMapping
}

export type ControllersMappingType = {
  [K in keyof typeof controllersMapping]: InstanceType<typeof controllersMapping[K]>
}
