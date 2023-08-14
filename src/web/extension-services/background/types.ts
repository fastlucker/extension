import AccountAdderController from 'ambire-common/src/controllers/accountAdder/accountAdder'
import { MainController } from 'ambire-common/src/controllers/main/main'

export const controllersMapping = {
  accountAdder: AccountAdderController
  // Add other controllers here:
  // - key is the name of the controller
  // - value is the type of the controller
}
const controllersMappingIncludingMainController = {
  main: MainController,
  ...controllersMapping
}

export type ControllersMappingType = {
  [K in keyof typeof controllersMappingIncludingMainController]: InstanceType<
    typeof controllersMappingIncludingMainController[K]
  >
}
