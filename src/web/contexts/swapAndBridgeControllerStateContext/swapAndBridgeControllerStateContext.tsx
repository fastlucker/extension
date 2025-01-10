/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { SwapAndBridgeController } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const SwapAndBridgeControllerStateContext = createContext<SwapAndBridgeController>(
  {} as SwapAndBridgeController
)

const SwapAndBridgeControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'swapAndBridge'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
    }
  }, [dispatch, mainState.isReady, state])

  const memoizedState = useDeepMemo(state)

  return (
    <SwapAndBridgeControllerStateContext.Provider
      value={useMemo(() => memoizedState, [memoizedState])}
    >
      {children}
    </SwapAndBridgeControllerStateContext.Provider>
  )
}

export { SwapAndBridgeControllerStateProvider, SwapAndBridgeControllerStateContext }
