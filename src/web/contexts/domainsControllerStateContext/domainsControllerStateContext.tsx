/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { DomainsController } from '@ambire-common/controllers/domains/domains'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useControllerState from '@web/hooks/useControllerState'

const DomainsControllerStateContext = createContext<DomainsController>({} as DomainsController)

const DomainsControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'domains'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller }
      })
    }
  }, [dispatch, mainState.isReady, state])

  return (
    <DomainsControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </DomainsControllerStateContext.Provider>
  )
}

export { DomainsControllerStateProvider, DomainsControllerStateContext }
