import logger from 'loglevel'

import {
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV,
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD
} from '@env'
import colors from '@modules/common/styles/colors'

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
