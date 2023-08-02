import { parse } from 'ambire-common/src/libs/bigintJson/bigintJson'
import React, { createContext, useMemo } from 'react'

import { isExtension } from '@web/constants/browserapi'
import {
  backgroundServiceContextDefaults,
  BackgroundServiceContextReturnType
} from '@web/contexts/backgroundServiceContext/types'
import { ControllersThatBroadcastUpdates } from '@web/extension-services/background/types'
import eventBus from '@web/extension-services/event/eventBus'
import PortMessage from '@web/extension-services/message/portMessage'

let dispatch: BackgroundServiceContextReturnType['dispatch']
let dispatchAsync: BackgroundServiceContextReturnType['dispatchAsync']

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

  portMessageChannel.listen(
    (data: {
      type: 'broadcast'
      method: ControllersThatBroadcastUpdates
      params: string // stringified controller
    }) => {
      if (data.type === 'broadcast') {
        eventBus.emit(data.method, parse(data.params))
      }
    }
  )

  eventBus.addEventListener('broadcastToBackground', (data) => {
    portMessageChannel.request({
      type: 'broadcast',
      method: data.method,
      params: data.data
    })
  })

  dispatch = (action) => {
    return portMessageChannel.request({
      type: action.type,
      // TypeScript being unable to guarantee that every member of the Action
      // union has the `params` property (some indeed don't), but this is fine.
      // @ts-ignore
      params: action.params
    })
  }

  dispatchAsync = dispatch
}

const BackgroundServiceContext = createContext<BackgroundServiceContextReturnType>(
  backgroundServiceContextDefaults
)

const BackgroundServiceProvider: React.FC<any> = ({ children }) => (
  <BackgroundServiceContext.Provider value={useMemo(() => ({ dispatch, dispatchAsync }), [])}>
    {children}
  </BackgroundServiceContext.Provider>
)

export { BackgroundServiceProvider, BackgroundServiceContext }
