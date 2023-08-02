import { useContext, useEffect, useState } from 'react'

import { BackgroundServiceContext } from '@web/contexts/backgroundServiceContext'
import { ControllersMapping } from '@web/extension-services/background/background'
import eventBus from '@web/extension-services/event/eventBus'

export default function useBackgroundService<T extends keyof ControllersMapping>(
  controllerName?: T
) {
  const context = useContext(BackgroundServiceContext)
  // Tge workaround with "{} as ControllersMapping[T]"" is a type assertion,
  // because usually for every controller there should be onUpdate event in the
  // beginning after the initialization process completes that will set the
  // initial state. TS doesn't know that and thinks that state can always be {}.
  const [state, setState] = useState<ControllersMapping[T]>({} as ControllersMapping[T])

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
