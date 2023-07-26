import React, { createContext, useMemo } from 'react'

import { isExtension } from '@web/constants/browserapi'
import {
  backgroundServiceContextDefaults,
  BackgroundServiceContextReturnType
} from '@web/contexts/backgroundServiceContext/types'
import { LedgerControllerMethods } from '@web/extension-services/background/controller-methods/ledgerControllerMethods'
import { MainControllerMethods } from '@web/extension-services/background/controller-methods/mainControllerMethods'
import eventBus from '@web/extension-services/event/eventBus'
import PortMessage from '@web/extension-services/message/portMessage'

let mainCtrl: MainControllerMethods
let ledgerCtrl: LedgerControllerMethods
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

  mainCtrl = new Proxy(
    {},
    {
      get(obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: 'mainControllerMethods',
            method: key,
            params
          })
        }
      }
    }
  ) as MainControllerMethods

  ledgerCtrl = new Proxy(
    {},
    {
      get(obj, key) {
        return function (...params: any) {
          return portMessageChannel.request({
            type: 'ledgerControllerMethods',
            method: key,
            params
          })
        }
      }
    }
  ) as LedgerControllerMethods

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
}

const BackgroundServiceContext = createContext<BackgroundServiceContextReturnType>(
  backgroundServiceContextDefaults
)

const BackgroundServiceProvider: React.FC<any> = ({ children }) => (
  <BackgroundServiceContext.Provider
    value={useMemo(
      () => ({
        mainCtrl,
        wallet,
        ledgerCtrl
      }),
      []
    )}
  >
    {children}
  </BackgroundServiceContext.Provider>
)

export { BackgroundServiceProvider, BackgroundServiceContext }
