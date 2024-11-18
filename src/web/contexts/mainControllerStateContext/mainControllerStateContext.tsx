/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { MainController } from '@ambire-common/controllers/main/main'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'

const MainControllerStateContext = createContext<MainController>({} as MainController)

const MainControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'main'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller }
    })
  }, [dispatch])

  return (
    <MainControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </MainControllerStateContext.Provider>
  )
}

export { MainControllerStateProvider, MainControllerStateContext }
