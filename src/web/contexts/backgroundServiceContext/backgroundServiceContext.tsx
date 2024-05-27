/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { createContext, useEffect, useMemo } from 'react'

import { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { ToastOptions } from '@common/contexts/toastContext'
import useToast from '@common/hooks/useToast'
import { isExtension } from '@web/constants/browserapi'
import {
  backgroundServiceContextDefaults,
  BackgroundServiceContextReturnType
} from '@web/contexts/backgroundServiceContext/types'
import { Action } from '@web/extension-services/background/actions'
import eventBus from '@web/extension-services/event/eventBus'
import { PortMessenger } from '@web/extension-services/messengers'
import { getUiType } from '@web/utils/uiType'

let dispatch: BackgroundServiceContextReturnType['dispatch']

// Facilitate communication between the different parts of the browser extension.
// Utilizes the PortMessenger class to establish a connection between the popup
// and background pages, and the eventBus to emit and listen for events.
// This allows the browser extension's UI to send and receive messages to and
// from the background process (needed for updating the browser extension UI
// based on the state of the background process and for sending dApps-initiated
// actions to the background for further processing.
if (isExtension) {
  const pm = new PortMessenger()
  let backgroundReady: boolean = false
  const actionsBeforeBackgroundReady: Action[] = []

  const isTab = getUiType().isTab
  const isActionWindow = getUiType().isActionWindow

  let portName = 'popup'
  if (isTab) portName = 'tab'
  if (isActionWindow) portName = 'action-window'

  const connectPort = () => {
    pm.connect(portName)
    // connect to the portMessenger initialized in the background
    // @ts-ignore
    pm.addListener(pm.ports[0].id, (messageType, { method, params, forceEmit }) => {
      if (method === 'portReady') {
        backgroundReady = true
        actionsBeforeBackgroundReady.forEach((a) => dispatch(a))
        actionsBeforeBackgroundReady.length = 0
        return
      }
      if (messageType === '> ui') {
        eventBus.emit(method, params, forceEmit)
      }
      if (messageType === '> ui-error') {
        eventBus.emit('error', params)
      }
      if (messageType === '> ui-toast') {
        eventBus.emit(method, params)
      }
    })

    setTimeout(() => {
      if (!backgroundReady) connectPort()
    }, 150)
  }

  connectPort()

  const ACTIONS_TO_DISPATCH_EVEN_WHEN_HIDDEN = ['INIT_CONTROLLER_STATE']

  dispatch = (action) => {
    // Dispatch only if the tab/window is focused/active. Otherwise, an action can be dispatched multiple times
    // from all opened extension instances, leading to some unpredictable behaviors of the state.
    if (document.hidden && !ACTIONS_TO_DISPATCH_EVEN_WHEN_HIDDEN.includes(action.type)) return

    if (!backgroundReady) {
      actionsBeforeBackgroundReady.push(action)
    } else {
      pm.send('> background', action)
    }
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

  useEffect(() => {
    const onAddToast = ({ text, options }: { text: string; options: ToastOptions }) =>
      addToast(text, options)

    eventBus.addEventListener('addToast', onAddToast)

    return () => eventBus.removeEventListener('addToast', onAddToast)
  }, [addToast])

  return (
    <BackgroundServiceContext.Provider value={useMemo(() => ({ dispatch }), [])}>
      {children}
    </BackgroundServiceContext.Provider>
  )
}

export { BackgroundServiceProvider, BackgroundServiceContext }
