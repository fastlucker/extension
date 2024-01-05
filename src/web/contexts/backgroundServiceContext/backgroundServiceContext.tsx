import React, { createContext, useEffect, useMemo } from 'react'

import { ErrorRef } from '@ambire-common/controllers/eventEmitter'
import useToast from '@common/hooks/useToast'
import { isExtension } from '@web/constants/browserapi'
import {
  backgroundServiceContextDefaults,
  BackgroundServiceContextReturnType
} from '@web/contexts/backgroundServiceContext/types'
import eventBus from '@web/extension-services/event/eventBus'
import PortMessage from '@web/extension-services/message/portMessage'
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

  portMessageChannel.listen((data: { type: string; method: string; params: any }) => {
    if (data.type === 'broadcast') {
      eventBus.emit(data.method, data.params)
    }
    if (data.type === 'broadcast-error') {
      eventBus.emit('error', data.params)
    }
  })

  eventBus.addEventListener('broadcastToBackground', (data) => {
    portMessageChannel.request({
      type: 'broadcast',
      method: data.method,
      params: data.data
    })
  })

  dispatch = (action) => {
    // FIXME:
    // Dispatch only if the tab/window is focused/active. Otherwise, an action can be dispatched multiple times
    // from all opened extension instances, leading to some unpredictable behaviors of the state.
    console.log('document.hidden?', document.hidden)
    console.log('dispatch', action.type, action?.params)
    // 2. if we are not focused - return Promise.resolve(undefined), but fill actions in set
    // 3. in useEffect here (service context) listen for focus event and dispatch all actions from set
    // if the current and all other Ambire window documents are hidden
    if (document.hidden) {
      // dispatch another action (with this action) to the background process that stores set of actions (unique)
      // check in the background - only if none of the tabs is active
      return Promise.resolve(undefined)
    }
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

const BackgroundServiceProvider: React.FC<any> = ({ children }) => {
  const { addToast } = useToast()

  // TODO: Maybe catch and do something if the document gets focused?
  // useEffect(() => {
  // listen if visible
  // if visible - dispatch all actions from set
  // check if in the background process we can check if window is focused
  // }, [])

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
  }, [])

  return (
    <BackgroundServiceContext.Provider value={useMemo(() => ({ dispatch, dispatchAsync }), [])}>
      {children}
    </BackgroundServiceContext.Provider>
  )
}

export { BackgroundServiceProvider, BackgroundServiceContext }
