import Constants from 'expo-constants'
import * as Sentry from 'sentry-expo'

import CONFIG from '@config/env'

Sentry.init({
  dsn: CONFIG.SENTRY_DSN,
  // In order to use the published release source maps with Issues in Sentry,
  // set your Expo revisionId as the Sentry release identifier:
  release: Constants?.manifest?.revisionId || 'N/A',
  // Match an error to a specific environment
  environment: CONFIG.APP_ENV
  // TODO:
  // We get a lot of "Network request failed" or similar errors from users.
  // They are connected to network problems of the users.
  // Having these issues in Sentry does not really help us.
  // These errors are not really valuable to use
  // and crowd the view on real issues. So ignore them all.
  // {@link https://github.com/getsentry/sentry/issues/12676#issuecomment-533538114}
  // ignoreErrors: ['Network request failed'],
  // Use these two for debugging purposed only
  // enableInExpoDevelopment: true,
  // If `true`, Sentry will try to print out useful debugging information
  // if something goes wrong with sending the event. Set it to `false` in production
  // debug: true,
})

// Access any @sentry/react-native exports via:
// Sentry.Native.*

// // Access any @sentry/browser exports via:
// Sentry.Browser.*
