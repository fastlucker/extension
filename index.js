import './shim'
import './global'
import './src/config/analytics/crash'
import 'react-native-gesture-handler'
import 'expo-asset'
import { Platform, UIManager } from 'react-native'
import { registerRootComponent } from 'expo'

// In order to get Layout API to work on Android.
// {@link https://reactnative.dev/docs/layoutanimation}
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

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
