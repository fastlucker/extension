import logger from 'loglevel'

import colors from '@common/styles/colors'
import {
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV,
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD,
  BROWSER_EXTENSION_LOG_UPDATED_CONTROLLER_STATE_ONLY
} from '@env'

logger.setDefaultLevel(
  process.env.APP_ENV === 'production'
    ? BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD
    : BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV
)

export const logInfoWithPrefix = (event: any, ctrlName: string, ...args: any) => {
  const ctrlState = ctrlName === 'main' ? args[0] : args[0][ctrlName]

  const logData =
    BROWSER_EXTENSION_LOG_UPDATED_CONTROLLER_STATE_ONLY === 'true' ? ctrlState : [...args]

  logger.info(
    `%c [Ambire] (${new Date().toLocaleTimeString()}) ${event}`,
    `font-weight: bold; background-color: ${colors.heliotrope}; color: white;`,
    logData
  )
}

export const logWarnWithPrefix = (event: any, ...args: any) => {
  logger.warn(
    `%c [Ambire] (${new Date().toLocaleTimeString()}) ${event}`,
    `font-weight: bold; background-color: ${colors.mustard}; color: white;`,
    ...args
  )
}

export default logger
