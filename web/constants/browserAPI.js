import { IS_FIREFOX } from './env.js'

export const browserAPI = IS_FIREFOX ? browser : chrome
