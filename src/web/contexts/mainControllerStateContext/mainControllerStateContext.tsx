/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

import { MainController } from '@ambire-common/controllers/main/main'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'

const MainControllerStateContext = createContext<MainController>({} as MainController)

const MainControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as MainController)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller: 'main' }
    })
  }, [dispatch])

  useEffect(() => {
    const onUpdate = (newState: MainController, forceEmit?: boolean) => {
      if (forceEmit) {
        flushSync(() => setState(newState))
      } else {
        setState(newState)
      }
    }

    eventBus.addEventListener('main', onUpdate)

    return () => eventBus.removeEventListener('main', onUpdate)
  }, [])

  return (
    <MainControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </MainControllerStateContext.Provider>
  )
}

export { MainControllerStateProvider, MainControllerStateContext }
