import 'react-native-gesture-handler'
import 'expo-asset'

import { registerRootComponent } from 'expo'

import { Buffer } from 'buffer'
global.Buffer = Buffer

// Ethers.js installation guide for RN:
// https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative-shims
import 'react-native-get-random-values'

import '@ethersproject/shims'

// eslint-disable-next-line
import App from './App'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
