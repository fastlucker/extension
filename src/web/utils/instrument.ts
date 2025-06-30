import CONFIG, { APP_VERSION } from '@common/config/env'
import { SENTRY_DSN_BROWSER_EXTENSION } from '@env'
import * as Sentry from '@sentry/react'
import { isExtension } from '@web/constants/browserapi'
import storage from '@web/extension-services/background/webapi/storage'

import { getUiType } from './uiType'

const { uiType } = getUiType()

// Initialize Sentry conditionally based on the user's
// settings. The user preference will take effect after
// reloading the page or opening a new tab.
const initializeSentry = async () => {
  if (!isExtension) return

  if (!SENTRY_DSN_BROWSER_EXTENSION) {
    console.warn('Sentry DSN for browser extension is not defined. Sentry will not be initialized.')
    return
  }

  const isEnabled = await storage.get('crashAnalyticsEnabled', false)

  if (!isEnabled) return

  Sentry.init({
    dsn: SENTRY_DSN_BROWSER_EXTENSION,
    environment: CONFIG.APP_ENV,
    release: `extension-${process.env.WEB_ENGINE}@${APP_VERSION}`,
    // Disables sending personally identifiable information
    sendDefaultPii: false,
    integrations: [],
    initialScope: {
      tags: {
        content: 'ui',
        uiType
      }
    }
  })
}

initializeSentry()
