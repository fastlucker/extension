/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useControllerState from '@web/hooks/useControllerState'

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

  return (
    <AccountAdderControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </AccountAdderControllerStateContext.Provider>
  )
}

export { AccountAdderControllerStateProvider, AccountAdderControllerStateContext }
