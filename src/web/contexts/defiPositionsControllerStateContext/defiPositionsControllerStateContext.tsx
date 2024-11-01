/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { DefiPositionsController } from '@ambire-common/controllers/defiPositions/defiPostions'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const DefiPositionsControllerStateContext = createContext<DefiPositionsController>(
  {} as DefiPositionsController
)

const DefiPositionsControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'defiPositions'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
    }
  }, [dispatch, mainState.isReady, state])

  return (
    <DefiPositionsControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </DefiPositionsControllerStateContext.Provider>
  )
}

export { DefiPositionsControllerStateProvider, DefiPositionsControllerStateContext }
