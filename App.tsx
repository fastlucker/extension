// So that the localization gets initialized at the beginning.
import '@config/localization'

import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import AppLoading from '@modules/app-loading/screens/AppLoading'
import { StorageProvider } from '@modules/common/contexts/storageContext'
import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

SplashScreen.preventAutoHideAsync().catch(console.warn) // TODO: log a sentry error

const App = () => {
  return (
    <GestureHandlerRootView
      style={[flexboxStyles.flex1, { backgroundColor: colors.backgroundColor }]}
    >
      <StatusBar style="light" />

      <StorageProvider>
        <AppLoading />
      </StorageProvider>
    </GestureHandlerRootView>
  )
}

export default App
