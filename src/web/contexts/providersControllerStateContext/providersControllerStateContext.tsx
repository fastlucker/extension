import React, { createContext, useEffect, useMemo } from 'react'

import { ProvidersController } from '@ambire-common/controllers/providers/providers'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const ProvidersControllerStateContext = createContext<ProvidersController>(
  {} as ProvidersController
)

const ProvidersControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'providers'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length)
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
  }, [dispatch, mainState.isReady, state])

  const memoizedState = useDeepMemo(state)

  return (
    <ProvidersControllerStateContext.Provider value={useMemo(() => memoizedState, [memoizedState])}>
      {children}
    </ProvidersControllerStateContext.Provider>
  )
}

export { ProvidersControllerStateProvider, ProvidersControllerStateContext }
