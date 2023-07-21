import React, { createContext, useMemo } from 'react'

import { isExtension } from '@web/constants/browserapi'
import {
  backgroundServiceContextDefaults,
  BackgroundServiceContextReturnType
} from '@web/contexts/backgroundServiceContext/types'
import eventBus from '@web/extension-services/event/eventBus'
import PortMessage from '@web/extension-services/message/portMessage'

let mainCtrl: BackgroundServiceContextReturnType['mainCtrl']
let wallet: BackgroundServiceContextReturnType['wallet']

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

  portMessageChannel.listen((data: any) => {
    if (data.type === 'broadcast') {
      eventBus.emit(data.method, data.params)
    }
  })

  eventBus.addEventListener('broadcastToBackground', (data) => {
    portMessageChannel.request({
      type: 'broadcast',
      method: data.method,
      params: data.data
    })
  })

  // eslint-disable-next-line prefer-const
  mainCtrl = new Proxy(
    {},
    {
      get(obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: 'mainController',
            method: key,
            params
          })
        }
      }
    }
  ) as BackgroundServiceContextReturnType['mainCtrl']

  // eslint-disable-next-line prefer-const
  wallet = new Proxy(
    {},
    {
      get(obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: 'walletController',
            method: key,
            params
          })
        }
      }
    }
  ) as BackgroundServiceContextReturnType['wallet']
}

const BackgroundServiceContext = createContext<BackgroundServiceContextReturnType>(
  backgroundServiceContextDefaults
)

const BackgroundServiceProvider: React.FC<any> = ({ children }) => (
  <BackgroundServiceContext.Provider
    value={useMemo(
      () => ({
        mainCtrl,
        wallet
      }),
      []
    )}
  >
    {children}
  </BackgroundServiceContext.Provider>
)

export { BackgroundServiceProvider, BackgroundServiceContext }
