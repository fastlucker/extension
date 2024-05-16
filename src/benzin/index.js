// TODO: Figure out how to access these imports
// import { HUMANIZER_META_KEY } from '@ambire-common/libs/humanizer'
// import humanizerInfo from '@ambire-common/consts/humanizer/humanizerInfo.json'

import '../../shim'

import '../../global'
import 'react-native-gesture-handler'
import 'expo-asset'

import { registerRootComponent } from 'expo'
import BenzinInit from './BenzinInit'

// TODO: Check if setting the storage is needed, similar to the way that's checked in the background.js
// localStorage.setItem(HUMANIZER_META_KEY, stringify(humanizerInfo))

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(BenzinInit)
