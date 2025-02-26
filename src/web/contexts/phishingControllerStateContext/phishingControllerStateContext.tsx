import React, { createContext, useEffect } from 'react'

import { PhishingController } from '@ambire-common/controllers/phishing/phishing'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const PhishingControllerStateContext = createContext<PhishingController>({} as PhishingController)

const PhishingControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'phishing'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length)
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
  }, [dispatch, mainState.isReady, state])

  const memoizedState = useDeepMemo(state, controller)

  return (
    <PhishingControllerStateContext.Provider value={memoizedState}>
      {children}
    </PhishingControllerStateContext.Provider>
  )
}

export { PhishingControllerStateProvider, PhishingControllerStateContext }
