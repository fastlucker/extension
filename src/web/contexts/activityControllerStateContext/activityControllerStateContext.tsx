/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { ActivityController } from '@ambire-common/controllers/activity/activity'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useControllerState from '@web/hooks/useControllerState'

const ActivityControllerStateContext = createContext<ActivityController>({} as ActivityController)

const ActivityControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'activity'
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
    <ActivityControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </ActivityControllerStateContext.Provider>
  )
}

export { ActivityControllerStateProvider, ActivityControllerStateContext }
