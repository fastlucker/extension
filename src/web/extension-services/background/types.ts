import AccountAdderController from 'ambire-common/src/controllers/accountAdder/accountAdder'

export const controllersMapping = {
  accountAdder: AccountAdderController
  // Add other controllers here:
  // - key is the name of the controller
  // - value is the type of the controller
}

export type ControllerName = 'main' | keyof typeof controllersMapping

export type ControllersMappingType = {
  [K in keyof typeof controllersMapping]: InstanceType<typeof controllersMapping[K]>
}
