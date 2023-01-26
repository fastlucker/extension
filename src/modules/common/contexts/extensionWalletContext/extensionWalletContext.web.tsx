import React, { createContext, useMemo } from 'react'

import {
  ExtensionWalletController,
  WalletControllerType
} from '@modules/common/contexts/extensionWalletContext/types'
import { isExtension } from '@web/constants/browserapi'
import eventBus from '@web/event/eventBus'
import PortMessage from '@web/message/portMessage'

let extensionWallet: WalletControllerType

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
  ) as WalletControllerType
}

const ExtensionWalletContext = createContext<{
  extensionWallet: ExtensionWalletController
} | null>(null)

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
