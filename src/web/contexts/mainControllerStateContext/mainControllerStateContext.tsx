import { MainController } from 'ambire-common/src/controllers/main/main'
/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'

const MainControllerStateContext = createContext<MainController>({} as MainController)

const MainControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as MainController)
  const { dispatchAsync } = useBackgroundService()

  useEffect(() => {
    const getControllersState = async () => {
      const mainControllerState = await dispatchAsync({
        type: 'GET_CONTROLLER_STATE',
        params: { controller: 'main' }
      })
      return setState(mainControllerState)
    }

    ;(async () => {
      await getControllersState()
    })()
  }, [dispatchAsync])

  useEffect(() => {
    const onUpdate = (newState: MainController) => {
      setState(newState)
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
