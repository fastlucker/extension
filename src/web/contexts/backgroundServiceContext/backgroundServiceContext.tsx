/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { createContext, useEffect, useMemo } from 'react'

import { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import useToast from '@common/hooks/useToast'
import { isExtension } from '@web/constants/browserapi'
import {
  backgroundServiceContextDefaults,
  BackgroundServiceContextReturnType
} from '@web/contexts/backgroundServiceContext/types'
import eventBus from '@web/extension-services/event/eventBus'
import { PortMessage } from '@web/extension-services/messengers'
import { getUiType } from '@web/utils/uiType'

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

  const isTab = getUiType().isTab
  const isNotification = getUiType().isNotification

  let portName = 'popup'
  if (isTab) portName = 'tab'
  if (isNotification) portName = 'notification'

  portMessageChannel.connect(portName)

  // @ts-ignore
  portMessageChannel.listen((messageType, { method, params }) => {
    if (messageType === '> ui') {
      eventBus.emit(method, params)
    }
    if (messageType === '> ui-error') {
      eventBus.emit('error', params)
    }
  })

  const ACTIONS_TO_DISPATCH_EVEN_WHEN_HIDDEN = ['INIT_CONTROLLER_STATE']

  dispatch = (action) => {
    // Dispatch only if the tab/window is focused/active. Otherwise, an action can be dispatched multiple times
    // from all opened extension instances, leading to some unpredictable behaviors of the state.
    if (document.hidden && !ACTIONS_TO_DISPATCH_EVEN_WHEN_HIDDEN.includes(action.type)) return

    portMessageChannel.send('> background', action)
  }

  dispatchAsync = (action) => {
    // Dispatch only if the tab/window is focused/active. Otherwise, an action can be dispatched multiple times
    // from all opened extension instances, leading to some unpredictable behaviors of the state.
    if (document.hidden && !ACTIONS_TO_DISPATCH_EVEN_WHEN_HIDDEN.includes(action.type))
      return Promise.resolve(undefined)
    return portMessageChannel.request({
      type: action.type,
      // TypeScript being unable to guarantee that every member of the Action
      // union has the `params` property (some indeed don't), but this is fine.
      // @ts-ignore
      params: action.params
    })
  }
}

const BackgroundServiceContext = createContext<BackgroundServiceContextReturnType>(
  backgroundServiceContextDefaults
)

const BackgroundServiceProvider: React.FC<any> = ({ children }) => {
  const { addToast } = useToast()

  useEffect(() => {
    const onError = (newState: { errors: ErrorRef[]; controller: string }) => {
      const lastError = newState.errors[newState.errors.length - 1]
      if (lastError) {
        if (lastError.level !== 'silent')
          addToast(lastError.message, { timeout: 4000, type: 'error' })

        console.error(
          `Error in ${newState.controller} controller. Inspect background page to see the full stack trace.`
        )
      }
    }

    eventBus.addEventListener('error', onError)

    return () => eventBus.removeEventListener('error', onError)
  }, [addToast])

  return (
    <BackgroundServiceContext.Provider
      value={useMemo(
        () => ({
          dispatch,
          dispatchAsync
        }),
        []
      )}
    >
      {children}
    </BackgroundServiceContext.Provider>
  )
}

export { BackgroundServiceProvider, BackgroundServiceContext }
