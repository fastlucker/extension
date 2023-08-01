import React, { createContext, useMemo } from 'react'

import { isExtension } from '@web/constants/browserapi'
import {
  backgroundServiceContextDefaults,
  BackgroundServiceContextReturnType
} from '@web/contexts/backgroundServiceContext/types'
import eventBus from '@web/extension-services/event/eventBus'
import PortMessage from '@web/extension-services/message/portMessage'

let wallet: BackgroundServiceContextReturnType['wallet']
let dispatch: BackgroundServiceContextReturnType['dispatch']

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

  wallet = new Proxy(
    {},
    {
      get(obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: 'walletControllerMethods',
            method: key,
            params
          })
        }
      }
    }
  ) as BackgroundServiceContextReturnType['wallet']

  dispatch = (action) => {
    return portMessageChannel.request({
      type: action.type,
      params: action.params
    })
  }
}

const BackgroundServiceContext = createContext<BackgroundServiceContextReturnType>(
  backgroundServiceContextDefaults
)

const BackgroundServiceProvider: React.FC<any> = ({ children }) => (
  <BackgroundServiceContext.Provider
    value={useMemo(
      () => ({
        wallet,
        dispatch
      }),
      []
    )}
  >
    {children}
  </BackgroundServiceContext.Provider>
)

export { BackgroundServiceProvider, BackgroundServiceContext }
