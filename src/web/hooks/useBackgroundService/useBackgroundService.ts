import { useContext, useEffect, useState } from 'react'

import { BackgroundServiceContext } from '@web/contexts/backgroundServiceContext'
import { ControllersThatBroadcastUpdates } from '@web/extension-services/background/types'
import eventBus from '@web/extension-services/event/eventBus'

export default function useBackgroundService(controllerName?: string) {
  const context = useContext(BackgroundServiceContext)
  const [state, setState] = useState({})

  if (!context) {
    throw new Error('useBackgroundService must be used within an BackgroundServiceProvider')
  }

  useEffect(() => {
    if (controllerName) {
      const onUpdate = async (newState: any) => {
        setState(newState)
      }

      eventBus.addEventListener(controllerName, onUpdate)

      return () => {
        eventBus.removeEventListener(controllerName, onUpdate)
      }
    }
    return () => {}
  }, [controllerName])

  return {
    state,
    ...context
  }
}
