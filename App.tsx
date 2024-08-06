// So that the localization gets initialized at the beginning.
import '@common/config/localization'

import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { isWeb } from '@common/config/env'
import AppInit from '@common/modules/app-init/screens/AppInit'
import colors from '@common/styles/colors'
import flexboxStyles from '@common/styles/utils/flexbox'
import { isExtension } from '@web/constants/browserapi'

SplashScreen.preventAutoHideAsync().catch(console.warn) // TODO: log a sentry error

const consoleWarn = console.warn
const SUPPRESSED_WARNINGS = [
  // 2 <Routes > components are rendered in the tree at the same time to allow for lazy loading.
  'No routes matched location',
  'setNativeProps is deprecated. Please update props using React state instead.',
  'Animated: `useNativeDriver` is not supported because the native animated module is missing. Falling back to JS-based animation.',
  // False positive in accountAdderIntroStepsContext
  'Warning: useLayoutEffect does nothing on the server'
]

console.warn = function filterWarnings(msg, ...args) {
  if (!SUPPRESSED_WARNINGS.some((entry) => msg?.includes(entry))) {
    consoleWarn(msg, ...args)
  }
}

const App = () => {
  if (!isExtension && isWeb) return 'Extension build successful! You can now close this window.'

  return (
    <GestureHandlerRootView style={[flexboxStyles.flex1, { backgroundColor: colors.white }]}>
      <StatusBar style="light" backgroundColor={colors.zircon} />

      <AppInit />
    </GestureHandlerRootView>
  )
}

export default App
