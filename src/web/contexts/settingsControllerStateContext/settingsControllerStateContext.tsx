/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { SettingsController } from '@ambire-common/controllers/settings/settings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useControllerState from '@web/hooks/useControllerState'

const SettingsControllerStateContext = createContext<SettingsController>({} as SettingsController)

const SettingsControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'settings'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller }
      })
    }
  }, [dispatch, mainState.isReady, state])

  return (
    <SettingsControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </SettingsControllerStateContext.Provider>
  )
}

export { SettingsControllerStateProvider, SettingsControllerStateContext }
