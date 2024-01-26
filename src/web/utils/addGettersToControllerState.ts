import { parse, stringify } from '@ambire-common/libs/bigintJson/bigintJson'

export const addGettersToControllerState = (controller: Object) => ({
  // stringify and then parse to add the getters to the public state
  ...parse(stringify(controller)),
  // spread the original controller object to include all its properties in the new object
  ...controller
})
