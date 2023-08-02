import { useContext, useEffect, useState } from 'react'

import { BackgroundServiceContext } from '@web/contexts/backgroundServiceContext'
import { ControllersMapping } from '@web/extension-services/background/background'
import eventBus from '@web/extension-services/event/eventBus'

export default function useBackgroundService<T extends keyof ControllersMapping>(
  controllerName?: T
) {
  const context = useContext(BackgroundServiceContext)
  const [state, setState] = useState<ControllersMapping[T] | {}>({})

  if (!context) {
    throw new Error('useBackgroundService must be used within an BackgroundServiceProvider')
  }

  useEffect(() => {
    if (controllerName) {
      const onUpdate = async (newState: ControllersMapping[T]) => {
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
