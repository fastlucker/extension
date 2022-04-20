import './shim'
import './global'
import '@config/analytics/CrashAnalytics'
import '@modules/common/services/layoutAnimation'
import 'react-native-gesture-handler'
import 'expo-asset'

import { registerRootComponent } from 'expo'

import { LogBox } from 'react-native'
// Ignore the Android specific warnings for setting long timers
// {@link https://stackoverflow.com/a/64832663/1333836}
LogBox.ignoreLogs(['Setting a timer'])

// eslint-disable-next-line
import App from './App'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
