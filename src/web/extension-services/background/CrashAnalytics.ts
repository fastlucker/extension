import * as Sentry from '@sentry/browser'

export { CRASH_ANALYTICS_WEB_CONFIG } from '@common/config/analytics/CrashAnalytics'

export const captureException = Sentry.captureException
export const captureMessage = Sentry.captureMessage
export const setExtraContext = Sentry.setExtra
export const setUserContext = Sentry.setUser
