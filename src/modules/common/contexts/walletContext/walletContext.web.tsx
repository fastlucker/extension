import React, { createContext, useMemo } from 'react'

import { WalletControllerType } from '@modules/common/contexts/walletContext/types'
import { isExtension } from '@web/constants/browserapi'
import eventBus from '@web/event/eventBus'
import PortMessage from '@web/message/portMessage'

import { WalletController } from './types'

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

const WalletContext = createContext<{
  wallet: WalletController
} | null>(null)

const WalletProvider: React.FC<any> = ({ children }) => (
  <WalletContext.Provider
    value={useMemo(
      () => ({
        wallet
      }),
      []
    )}
  >
    {children}
  </WalletContext.Provider>
)

export { WalletProvider, WalletContext }
