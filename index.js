import 'react-native-gesture-handler'
import 'expo-asset'

import { registerRootComponent } from 'expo'

// Installed and imported because of a dependency that uses Buffer functions
// Hack to make Buffer with in RN proj:
// https://stackoverflow.com/questions/48432524/cant-find-variable-buffer/54448930
import { Buffer } from 'buffer'
global.Buffer = Buffer

// Ethers.js installation guide for RN:
// https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative-shims
import 'react-native-get-random-values'

import '@ethersproject/shims'

// In order to get Layout API to work on Android.
// {@link https://reactnative.dev/docs/layoutanimation}
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

// eslint-disable-next-line
import App from './App'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
