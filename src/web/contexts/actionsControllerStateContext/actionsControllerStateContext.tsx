/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { ActionsController } from '@ambire-common/controllers/actions/actions'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import { getUiType } from '@web/utils/uiType'

const ActionsControllerStateContext = createContext<ActionsController>({} as ActionsController)

const ActionsControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'actions'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const prevState: ActionsController = usePrevious(state) || ({} as ActionsController)
  const { navigate } = useNavigation()
  useEffect(() => {
    dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
    if (getUiType().isActionWindow) {
      dispatch({ type: 'ACTIONS_CONTROLLER_SET_WINDOW_LOADED' })
    }
  }, [dispatch])

  useEffect(() => {
    if (getUiType().isActionWindow) {
      const id = state.currentAction?.id
      const prevId = prevState?.currentAction?.id
      if (prevId !== id) {
        setTimeout(() => navigate('/'))
      }
    }
  }, [prevState.currentAction?.id, state.currentAction?.id, navigate])

  // If the popup is opened but there are pending actions,
  // first show the actions before allowing the user to proceed to the dashboard screen
  useEffect(() => {
    const isPopup = getUiType().isPopup

    if (
      isPopup &&
      state.actionWindow?.id &&
      state.currentAction &&
      state.currentAction?.type !== 'benzin'
    ) {
      dispatch({ type: 'ACTIONS_CONTROLLER_FOCUS_ACTION_WINDOW' })
      window.close()
    }
  }, [dispatch, state.currentAction?.type, state.actionWindow?.id, state.currentAction])

  return (
    <ActionsControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </ActionsControllerStateContext.Provider>
  )
}

export { ActionsControllerStateProvider, ActionsControllerStateContext }
