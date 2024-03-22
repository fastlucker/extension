/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { ActivityController } from '@ambire-common/controllers/activity/activity'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

const ActivityControllerStateContext = createContext<ActivityController>({} as ActivityController)

const ActivityControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as ActivityController)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'activity' }
      })
    }
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    const onUpdate = (newState: ActivityController) => {
      setState(newState)
    }

    eventBus.addEventListener('activity', onUpdate)

    return () => eventBus.removeEventListener('activity', onUpdate)
  }, [])

  return (
    <ActivityControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </ActivityControllerStateContext.Provider>
  )
}

export { ActivityControllerStateProvider, ActivityControllerStateContext }
