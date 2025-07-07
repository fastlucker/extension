import { CRASH_ANALYTICS_WEB_CONFIG } from '@common/config/analytics/CrashAnalytics.web'
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
    ...CRASH_ANALYTICS_WEB_CONFIG,
    initialScope: {
      tags: {
        content: 'ui',
        uiType
      }
    }
  })
}

initializeSentry()
