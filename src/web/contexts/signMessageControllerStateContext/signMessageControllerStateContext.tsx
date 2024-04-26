/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useControllerState from '@web/hooks/useControllerState'

const SignMessageControllerStateContext = createContext<SignMessageController>(
  {} as SignMessageController
)

const SignMessageControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'signMessage'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
    }
  }, [dispatch, mainState.isReady, state])

  return (
    <SignMessageControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </SignMessageControllerStateContext.Provider>
  )
}

export { SignMessageControllerStateProvider, SignMessageControllerStateContext }
