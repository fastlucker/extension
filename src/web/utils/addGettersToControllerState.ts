import { parse, stringify } from '@ambire-common/libs/bigintJson/bigintJson'

export const addGettersToControllerState = (controller: Object) => ({
  // stringify and then parse to add the getters to the public state
  ...parse(stringify(controller)),
  // spread the original controller object to include all other properties,
  // that are otherwise stripped out by the stringify/parse process
  ...controller
})
