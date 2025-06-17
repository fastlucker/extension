import logger, { LogLevelDesc, LogLevelNames } from 'loglevel'

import {
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV,
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD
} from '@env'

export const LOG_LEVEL_PROD = BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD || 'warn'
export const LOG_LEVEL_DEV = BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV || 'trace'

logger.setDefaultLevel(process.env.APP_ENV === 'production' ? LOG_LEVEL_PROD : LOG_LEVEL_DEV)

export const logInfoWithPrefix = (event: any, ...args: any) => {
  logger.info(
    `%c [Ambire] (${new Date().toLocaleTimeString()}) ${event}`,
    `font-weight: bold; background-color: ${'#A36AF8'}; color: white;`,
    ...args
  )
}

export const logWarnWithPrefix = (event: any, ...args: any) => {
  logger.warn(
    `%c [Ambire] (${new Date().toLocaleTimeString()}) ${event}`,
    `font-weight: bold; background-color: ${'#A36AF8'}; color: white;`,
    ...args
  )
}

export const getCurrentLogLevel = (): LogLevelNames => logger.getLevel()

export const setLogLevel = (level: LogLevelNames) => logger.setLevel(level)

export type { LogLevelNames }
export default logger
