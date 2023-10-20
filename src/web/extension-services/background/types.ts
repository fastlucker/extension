import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import { ActivityController } from '@ambire-common/controllers/activity/activity'
import { KeystoreController } from '@ambire-common/controllers/keystore/keystore'
import { MainController } from '@ambire-common/controllers/main/main'
import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import { TransferController } from '@ambire-common/controllers/transfer/transfer'
import { NotificationController } from '@web/extension-services/background/controllers/notification'

export const controllersNestedInMainMapping = {
  accountAdder: AccountAdderController,
  keystore: KeystoreController,
  signMessage: SignMessageController,
  portfolio: PortfolioController,
  activity: ActivityController,
  transfer: TransferController
  // Add other controllers here:
  // - key is the name of the controller
  // - value is the type of the controller
}
export const controllersMapping = {
  main: MainController,
  notification: NotificationController,
  ...controllersNestedInMainMapping
}

export type ControllersMappingType = {
  [K in keyof typeof controllersMapping]: InstanceType<typeof controllersMapping[K]>
}
