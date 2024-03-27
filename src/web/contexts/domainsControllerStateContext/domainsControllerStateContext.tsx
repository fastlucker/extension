/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { DomainsController } from '@ambire-common/controllers/domains/domains'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

const DomainsControllerStateContext = createContext<DomainsController>({} as DomainsController)

const DomainsControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as DomainsController)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'domains' }
      })
    }
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    const onUpdate = (newState: DomainsController) => {
      setState(newState)
    }

    eventBus.addEventListener('domains', onUpdate)

    return () => eventBus.removeEventListener('domains', onUpdate)
  }, [])

  return (
    <DomainsControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </DomainsControllerStateContext.Provider>
  )
}

export { DomainsControllerStateProvider, DomainsControllerStateContext }
