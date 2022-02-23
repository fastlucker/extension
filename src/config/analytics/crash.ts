import * as Sentry from 'sentry-expo'

import CONFIG from '@config/env'

Sentry.init({
  dsn: CONFIG.SENTRY_DSN
  // enableInExpoDevelopment: true,
  // debug: true // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})

// Access any @sentry/react-native exports via:
// Sentry.Native.*

// // Access any @sentry/browser exports via:
// Sentry.Browser.*
