/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { SettingsController } from '@ambire-common/controllers/settings/settings'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

const SettingsControllerStateContext = createContext<SettingsController>({} as SettingsController)

const SettingsControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as SettingsController)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'settings' }
      })
    }
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    const onUpdate = (newState: SettingsController) => {
      setState(newState)
    }

    eventBus.addEventListener('settings', onUpdate)

    return () => eventBus.removeEventListener('settings', onUpdate)
  }, [])

  return (
    <SettingsControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </SettingsControllerStateContext.Provider>
  )
}

export { SettingsControllerStateProvider, SettingsControllerStateContext }
