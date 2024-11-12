import React, { createContext, useEffect, useMemo } from 'react'

import { SelectedAccountController } from '@ambire-common/controllers/selectedAccount/selectedAccount'
import useConnectivity from '@common/hooks/useConnectivity'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const SelectedAccountControllerStateContext = createContext<SelectedAccountController>(
  {} as SelectedAccountController
)

const SelectedAccountControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'selectedAccount'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()
  const { isOffline } = useConnectivity()
  const accountsState = useAccountAdderControllerState()
  useEffect(() => {
    if (!Object.keys(state).length)
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    if (!state) return
    if (!state.account || !state.portfolio.latestStateByNetworks) return

    if (
      !isOffline &&
      state.portfolio.latestStateByNetworks.ethereum?.criticalError &&
      state.portfolio.latestStateByNetworks.polygon?.criticalError &&
      state.portfolio.latestStateByNetworks.optimism?.criticalError &&
      state.portfolio.isAllReady &&
      accountsState?.statuses?.updateAccountState === 'INITIAL'
    ) {
      dispatch({
        type: 'MAIN_CONTROLLER_RELOAD_SELECTED_ACCOUNT'
      })
    }
  }, [state, accountsState?.statuses?.updateAccountState, dispatch, isOffline])

  return (
    <SelectedAccountControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </SelectedAccountControllerStateContext.Provider>
  )
}

export { SelectedAccountControllerStateProvider, SelectedAccountControllerStateContext }
