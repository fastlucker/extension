import React, { createContext, useEffect, useMemo } from 'react'

import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'

const PortfolioControllerStateContext = createContext<PortfolioController>(
  {} as PortfolioController
)

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'portfolio'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
    }
  }, [dispatch, state])

  const memoizedState = useDeepMemo(state, controller)

  return (
    <PortfolioControllerStateContext.Provider value={useMemo(() => memoizedState, [memoizedState])}>
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
