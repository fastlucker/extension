import React, { createContext, useEffect, useMemo } from 'react'

import { NetworksController } from '@ambire-common/controllers/networks/networks'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const NetworksControllerStateContext = createContext<NetworksController>({} as NetworksController)

const NetworksControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'networks'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length)
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
  }, [dispatch, mainState.isReady, state])

  const memoizedState = useDeepMemo(state)

  return (
    <NetworksControllerStateContext.Provider value={useMemo(() => memoizedState, [memoizedState])}>
      {children}
    </NetworksControllerStateContext.Provider>
  )
}

export { NetworksControllerStateProvider, NetworksControllerStateContext }
