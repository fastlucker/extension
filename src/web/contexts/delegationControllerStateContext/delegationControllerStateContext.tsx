/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { DelegationController } from '@ambire-common/controllers/delegation/delegation'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const DelegationControllerStateContext = createContext<DelegationController>(
  {} as DelegationController
)

const CONTROLLER_NAME = 'delegation'
const DelegationControllerStateProvider: React.FC<any> = ({ children }) => {
  const state = useControllerState(CONTROLLER_NAME)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller: CONTROLLER_NAME } })
    }
  }, [dispatch, mainState.isReady, state])

  return (
    <DelegationControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </DelegationControllerStateContext.Provider>
  )
}

export { DelegationControllerStateContext, DelegationControllerStateProvider }
