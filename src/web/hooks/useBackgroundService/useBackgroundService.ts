import { useContext, useEffect, useState } from 'react'

import { BackgroundServiceContext } from '@web/contexts/backgroundServiceContext'
import { ControllersMappingType } from '@web/extension-services/background/background'
import eventBus from '@web/extension-services/event/eventBus'

export default function useBackgroundService<T extends keyof ControllersMappingType>(
  controllerName?: T
) {
  const context = useContext(BackgroundServiceContext)
  // The workaround with "{} as ControllersMappingType[T]"" is a type assertion,
  // because usually for every controller there should be onUpdate event in the
  // beginning after the initialization process completes that will set the
  // initial state. TS doesn't know that and thinks that state can always be {}.
  const [state, setState] = useState<ControllersMappingType[T]>({} as ControllersMappingType[T])

  if (!context) {
    throw new Error('useBackgroundService must be used within an BackgroundServiceProvider')
  }

  useEffect(() => {
    if (!controllerName) {
      return () => {}
    }
    const onUpdate = async (newState: ControllersMappingType[T]) => {
      setState(newState)
    }

    eventBus.addEventListener(controllerName, onUpdate)

    return () => eventBus.removeEventListener(controllerName, onUpdate)
  }, [controllerName])

  return {
    state,
    ...context
  }
}
