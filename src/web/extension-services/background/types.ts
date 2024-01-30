import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import { ActivityController } from '@ambire-common/controllers/activity/activity'
import { EmailVaultController } from '@ambire-common/controllers/emailVault/emailVault'
import { KeystoreController } from '@ambire-common/controllers/keystore/keystore'
import { MainController } from '@ambire-common/controllers/main/main'
import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import { SettingsController } from '@ambire-common/controllers/settings/settings'
import { SignAccountOpController } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import { TransferController } from '@ambire-common/controllers/transfer/transfer'
import { NotificationController } from '@web/extension-services/background/controllers/notification'

import { WalletStateController } from './controllers/wallet-state'

export const controllersNestedInMainMapping = {
  accountAdder: AccountAdderController,
  keystore: KeystoreController,
  signMessage: SignMessageController,
  portfolio: PortfolioController,
  activity: ActivityController,
  emailVault: EmailVaultController,
  signAccountOp: SignAccountOpController,
  transfer: TransferController,
  settings: SettingsController

  // Add the rest of the controllers that are part of the main controller:
  // - key is the name of the controller
  // - value is the type of the controller
}
export const controllersMapping = {
  main: MainController,
  notification: NotificationController,
  walletState: WalletStateController,
  ...controllersNestedInMainMapping
}

export type ControllersMappingType = {
  [K in keyof typeof controllersMapping]: InstanceType<typeof controllersMapping[K]>
}
