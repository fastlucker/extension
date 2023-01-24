// So that the localization gets initialized at the beginning.
import '@config/localization'

import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import AppLoading from '@modules/app-loading/screens/AppLoading'
import { WalletControllerType } from '@modules/common/contexts/walletContext/types'
import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { isExtension } from '@web/constants/browserapi'
import eventBus from '@web/event/eventBus'
import PortMessage from '@web/message/portMessage'

SplashScreen.preventAutoHideAsync().catch(console.warn) // TODO: log a sentry error

let wallet: WalletControllerType

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

  wallet = new Proxy(
    {},
    {
      get(obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: 'controller',
            method: key,
            params
          })
        }
      }
    }
  ) as WalletControllerType
}

const App = () => {
  return (
    <GestureHandlerRootView
      style={[flexboxStyles.flex1, { backgroundColor: colors.hauntedDreams }]}
    >
      <StatusBar style="light" backgroundColor={colors.wooed} />

      <AppLoading wallet={wallet} />
    </GestureHandlerRootView>
  )
}

export default App
