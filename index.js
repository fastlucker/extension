import './shim'
import './global'
import '@config/analytics/CrashAnalytics'
import '@modules/common/services/layoutAnimation'
import 'react-native-gesture-handler'
import 'expo-asset'

// Intl support for Hermes is not available yet for iOS. So these are polyfills.
// PS: on RN v0.70.0 the missing support for iOS landed.
// TODO: Import for iOS only.
import '@formatjs/intl-getcanonicallocales/polyfill'
import '@formatjs/intl-locale/polyfill'
import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/locale-data/en' // locale-data for en
import '@formatjs/intl-numberformat/polyfill'
import '@formatjs/intl-numberformat/locale-data/en' // locale-data for en

import { registerRootComponent } from 'expo'

import { LogBox } from 'react-native'

LogBox.ignoreLogs([
  // Ignore the Android specific warnings for setting long timers
  // {@link https://stackoverflow.com/a/64832663/1333836}
  'Setting a timer',
  // Ignores the warning: "ViewPropTypes will be removed from React Native.
  // Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'."
  // It is coming from the "lottie-react-native" package.
  // Updating it to v5.1.3 removes the warn, but the "expected version"
  // (based on expo doctor) is v5.0.1. Therefore, we keep using v5.0.1 for now,
  // and ignore the warning temporarily.
  "exported from 'deprecated-react-native-prop-types'."
])

// eslint-disable-next-line
import App from './App'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
