/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect } from 'react'

import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const AccountAdderControllerStateContext = createContext<AccountAdderController>(
  {} as AccountAdderController
)

const AccountAdderControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'accountAdder'
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
    <AccountAdderControllerStateContext.Provider value={memoizedState}>
      {children}
    </AccountAdderControllerStateContext.Provider>
  )
}

export { AccountAdderControllerStateProvider, AccountAdderControllerStateContext }
