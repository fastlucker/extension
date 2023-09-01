import AccountAdderController from 'ambire-common/src/controllers/accountAdder/accountAdder'
import { ActivityController } from 'ambire-common/src/controllers/activity/activity'
import { KeystoreController } from 'ambire-common/src/controllers/keystore/keystore'
import { MainController } from 'ambire-common/src/controllers/main/main'
import { PortfolioController } from 'ambire-common/src/controllers/portfolio/portfolio'
import { SignMessageController } from 'ambire-common/src/controllers/signMessage/signMessage'

import { NotificationController } from '@web/extension-services/background/controllers/notification'

export const controllersNestedInMainMapping = {
  accountAdder: AccountAdderController,
  keystore: KeystoreController,
  signMessage: SignMessageController,
  portfolio: PortfolioController,
  activity: ActivityController
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
