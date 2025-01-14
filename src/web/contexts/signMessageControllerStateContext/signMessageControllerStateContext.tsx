/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect } from 'react'

import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

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

  const memoizedState = useDeepMemo(state, controller)

  return (
    <SignMessageControllerStateContext.Provider value={memoizedState}>
      {children}
    </SignMessageControllerStateContext.Provider>
  )
}

export { SignMessageControllerStateProvider, SignMessageControllerStateContext }
