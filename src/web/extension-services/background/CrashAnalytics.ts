import * as Sentry from '@sentry/browser'

export { CRASH_ANALYTICS_WEB_CONFIG } from '@common/config/analytics/CrashAnalytics.web'

export const captureBackgroundException = Sentry.captureException
export const captureBackgroundMessage = Sentry.captureMessage
export const setBackgroundExtraContext = Sentry.setExtra
export const setBackgroundUserContext = Sentry.setUser
