import React, { createContext, useMemo } from 'react'

import {
  extensionWalletContextDefaults,
  ExtensionWalletContextReturnType,
  ExtensionWalletControllerType
} from '@common/contexts/extensionWalletContext/types'
import { isExtension } from '@web/constants/browserapi'
import eventBus from '@web/extension-services/event/eventBus'
import PortMessage from '@web/extension-services/message/portMessage'

let extensionWallet: ExtensionWalletControllerType

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

  extensionWallet = new Proxy(
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
  ) as ExtensionWalletControllerType
}

const ExtensionWalletContext = createContext<ExtensionWalletContextReturnType>(
  extensionWalletContextDefaults
)

const ExtensionWalletProvider: React.FC<any> = ({ children }) => (
  <ExtensionWalletContext.Provider
    value={useMemo(
      () => ({
        extensionWallet
      }),
      []
    )}
  >
    {children}
  </ExtensionWalletContext.Provider>
)

export { ExtensionWalletProvider, ExtensionWalletContext }
