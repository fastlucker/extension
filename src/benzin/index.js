import '../../shim'

import '../../global'
import 'react-native-gesture-handler'
import 'expo-asset'

import { registerRootComponent } from 'expo'
import BenzinInit from './BenzinInit'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(BenzinInit)
