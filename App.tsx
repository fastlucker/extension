// So that the localization gets initialized at the beginning.
import '@config/localization'

import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import AppLoading from '@modules/app-loading/screens/AppLoading'
import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { isExtension } from '@web/constants/browserapi'
import eventBus from '@web/event/eventBus'
import PortMessage from '@web/message/portMessage'

SplashScreen.preventAutoHideAsync().catch(console.warn) // TODO: log a sentry error

// Facilitate communication between the different parts of the browser extension.
// Utilizes the PortMessage class to establish a connection between the popup
// and background pages, and the eventBus to emit and listen for events.
// This allows the browser extension's UI to send and receive messages to and
// from the background process (needed for updating the browser extension UI
// based on the state of the background process and for sending dApps-initiated
// actions to the background for further processing.
if (isExtension) {
  const portMessageChannel = new PortMessage()

  portMessageChannel.connect('popup')

  portMessageChannel.listen((data) => {
    console.log('ui - portMessageChannel', data)
    if (data.type === 'broadcast') {
      eventBus.emit(data.method, data.params)
    }
  })

  eventBus.addEventListener('broadcastToBackground', (data) => {
    console.log('ui - broadcastToBackground', data)
    portMessageChannel.request({
      type: 'broadcast',
      method: data.method,
      params: data.data
    })
  })
}

const App = () => {
  return (
    <GestureHandlerRootView
      style={[flexboxStyles.flex1, { backgroundColor: colors.hauntedDreams }]}
    >
      <StatusBar style="light" backgroundColor={colors.wooed} />

      <AppLoading />
    </GestureHandlerRootView>
  )
}

export default App
