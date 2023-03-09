import logger from 'loglevel'

import colors from '@common/styles/colors'
import {
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV,
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD
} from '@env'

logger.setDefaultLevel(
  process.env.APP_ENV === 'production'
    ? BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD
    : BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV
)

export const logInfoWithPrefix = (event: any, ...args: any) => {
  logger.info(
    `%c [Ambire] (${new Date().toLocaleTimeString()}) ${event}`,
    `font-weight: bold; background-color: ${colors.heliotrope}; color: white;`,
    ...args
  )
}

export default logger
