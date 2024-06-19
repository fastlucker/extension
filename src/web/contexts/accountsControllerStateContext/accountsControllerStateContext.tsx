import React, { createContext, useEffect, useMemo } from 'react'

import { AccountsController } from '@ambire-common/controllers/accounts/accounts'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const AccountsControllerStateContext = createContext<AccountsController>({} as AccountsController)

const AccountsControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'accounts'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length)
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
  }, [dispatch, mainState.isReady, state])

  return (
    <AccountsControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </AccountsControllerStateContext.Provider>
  )
}

export { AccountsControllerStateProvider, AccountsControllerStateContext }
